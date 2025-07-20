
import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Landing = () => {
    return (
        <Container maxWidth="md">
            <Box sx={{ my: 4, textAlign: 'center' }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Welcome to CodeCollab
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    The real-time collaborative code editor.
                </Typography>
                <Box sx={{ mt: 4 }}>
                    <Button variant="contained" color="primary" component={RouterLink} to="/signup" sx={{ mr: 2 }}>
                        Get Started
                    </Button>
                    <Button variant="outlined" color="primary" component={RouterLink} to="/login">
                        Login
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default Landing;
