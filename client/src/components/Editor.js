import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-tomorrow';
import { jwtDecode } from 'jwt-decode';
import { Container, Button, Typography, Box, Paper, List, ListItem, ListItemText, Divider, Grid, Snackbar, Alert, IconButton } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';

const Editor = () => {
    const { id } = useParams();
    const [code, setCode] = useState('');
    const [history, setHistory] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const socketRef = useRef();

    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/documents/${id}`, {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setCode(res.data.content);
                if (res.data.history) {
                    setHistory(res.data.history.reverse());
                } else {
                    setHistory([]);
                }
            } catch (err) {
                if (err.response) {
                    console.error('Error fetching document:', err.response.data);
                } else {
                    console.error('Error fetching document:', err.message);
                }
            }
        };
        fetchDocument();

        const token = localStorage.getItem('token');
        let username = 'Guest';
        if (token) {
            try {
                const decoded = jwtDecode(token);
                username = decoded.user.username;
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }

        socketRef.current = io('http://localhost:5000');
        socketRef.current.emit('join-document', { documentId: id, username });

        socketRef.current.on('receive-code-change', (newCode) => {
            setCode(newCode);
        });


        return () => {
            socketRef.current.disconnect();
        };
    }, [id]);

    const onCodeChange = (newCode) => {
        setCode(newCode);
        socketRef.current.emit('code-change', { documentId: id, code: newCode });
    };

    const saveVersion = async () => {
        try {
            const res = await axios.post(`http://localhost:5000/api/documents/${id}/versions`, { content: code }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setHistory(res.data.reverse());
            alert('Version saved!');
        } catch (err) {
            if (err.response) {
                console.error('Error saving version:', err.response.data);
            } else {
                console.error('Error saving version:', err.message);
            }
            alert('Failed to save version.');
        }
    };

    const restoreVersion = (content) => {
        setCode(content);
        onCodeChange(content);
    };

    const deleteVersion = async (versionId) => {
        try {
            await axios.delete(`http://localhost:5000/api/documents/${id}/versions/${versionId}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setHistory(history.filter(version => version._id !== versionId));
            alert('Version deleted!');
        } catch (err) {
            if (err.response) {
                console.error('Error deleting version:', err.response.data);
            } else {
                console.error('Error deleting version:', err.message);
            }
            alert('Failed to delete version.');
        }
    };

    const handleCopyDocumentId = () => {
        navigator.clipboard.writeText(id);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Container disableGutters maxWidth={false} sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="h1">
                    Editor - Document ID: {id}
                </Typography>
                <Button 
                    variant="outlined" 
                    startIcon={<ContentCopyIcon />} 
                    onClick={handleCopyDocumentId}
                >
                    Copy ID
                </Button>
            </Box>
            <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid
                    item
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        height: '100%'
                    }}
                >
                    <Paper elevation={3} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <AceEditor
                            mode="javascript"
                            theme="tomorrow"
                            value={code}
                            onChange={onCodeChange}
                            name="code-editor"
                            editorProps={{ $blockScrolling: true }}
                            width="100%"
                            height="100%"
                            fontSize={16}
                        />
                    </Paper>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={saveVersion} 
                        sx={{ mt: 2, width: '120px' }}
                    >
                        Save Version
                    </Button>
                </Grid>
                <Grid
                    item
                    sx={{
                        width: 240,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        height: '50%'
                    }}
                >
                    <Paper elevation={3} sx={{ p: 2, flexGrow: 1, overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Version History
                        </Typography>
                        <List>
                            {history.map((version, index) => (
                                <React.Fragment key={version._id}>
                                    <ListItem
                                        secondaryAction={
                                            <IconButton edge="end" aria-label="delete" onClick={() => deleteVersion(version._id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                        button
                                        onClick={() => restoreVersion(version.content)}
                                    >
                                        <ListItemText
                                            primary={`Version ${history.length - index}`}
                                            secondary={new Date(version.timestamp).toLocaleString()}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    Document ID copied to clipboard!
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Editor;