
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Container, Button, Typography, Grid, Card, CardContent, CardActions, IconButton, TextField } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Dashboard = () => {
    const [documents, setDocuments] = useState([]);
    const [joinDocumentId, setJoinDocumentId] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/documents', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setDocuments(res.data);
            } catch (err) {
                if (err.response) {
                    console.error('Error fetching documents:', err.response.data);
                } else {
                    console.error('Error fetching documents:', err.message);
                }
            }
        };
        fetchDocuments();
    }, []);

    const createDocument = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/documents', {},
                {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
            navigate(`/documents/${res.data._id}`);
        } catch (err) {
            if (err.response) {
                console.error('Error creating document:', err.response.data);
            } else {
                console.error('Error creating document:', err.message);
            }
        }
    };

    const deleteDocument = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/documents/${id}`, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            setDocuments(documents.filter(doc => doc._id !== id));
        } catch (err) {
            if (err.response) {
                console.error('Error deleting document:', err.response.data);
            } else {
                console.error('Error deleting document:', err.message);
            }
        }
    };

    const handleJoinDocument = () => {
        if (joinDocumentId) {
            navigate(`/documents/${joinDocumentId}`);
        }
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                Dashboard
            </Typography>
            <Button variant="contained" onClick={createDocument} sx={{ mb: 4, mr: 2 }}>
                Create New Document
            </Button>
            <TextField
                label="Document ID"
                variant="outlined"
                size="small"
                sx={{ mb: 4, mr: 1 }}
                value={joinDocumentId}
                onChange={(e) => setJoinDocumentId(e.target.value)}
            />
            <Button variant="contained" color="secondary" onClick={handleJoinDocument} sx={{ mb: 4 }}>
                Join Document
            </Button>
            <Grid container spacing={4}>
                {documents.map(doc => (
                    <Grid item key={doc._id} xs={12} sm={6} md={4}>
                        <Card>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Document
                                </Typography>
                                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                    ID: {doc._id}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" component={RouterLink} to={`/documents/${doc._id}`}>
                                    Open
                                </Button>
                                <IconButton aria-label="delete" size="small" onClick={() => deleteDocument(doc._id)}>
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Dashboard;
