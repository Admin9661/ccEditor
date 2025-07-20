import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Snackbar, Alert } from '@mui/material';

const SnackbarAlert = React.forwardRef(function SnackbarAlert(props, ref) {
    return <Alert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', formData);
            localStorage.setItem('token', res.data.token);
            setSnackbarMessage('Signup successful!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            navigate('/dashboard');
        } catch (err) {
            if (err.response) {
                setSnackbarMessage(err.response.data.msg || 'Signup failed.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                console.error('Signup error:', err.response.data);
            } else {
                setSnackbarMessage('Network error or server is down.');
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
                console.error('Signup error:', err.message);
            }
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Sign Up
                </Typography>
                <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={onChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={onChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Sign Up
                    </Button>
                    <Typography variant="body2" align="center">
                        Already have an account? <RouterLink to="/login">Login</RouterLink>
                    </Typography>
                </Box>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <SnackbarAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </SnackbarAlert>
            </Snackbar>
        </Container>
    );
};
export default Signup;