import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import reactLogo from '../assets/sklentrlogo.png';

interface SplashScreenProps {
  onAnimationComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const [logoVisible, setLogoVisible] = useState(false);
  const [textsVisible, setTextsVisible] = useState(false);

  useEffect(() => {
    // Logo appears after 2 seconds
    const logoTimer = setTimeout(() => {
      setLogoVisible(true);
    }, 2000);

    // Texts appear after logo appears (2s + 2s = 4s total)
    const textsTimer = setTimeout(() => {
      setTextsVisible(true);
    }, 4000);

    // Splash screen stays for 4 seconds after texts appear (4s + 4s = 8s total)
    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 8000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(textsTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%', // Added this line
        backgroundColor: '#282c34',
        color: 'white',
        fontSize: '2em',
        overflow: 'hidden',
      }}
    >
      <Box
        component="img"
        src={reactLogo}
        alt="Logo"
        sx={{
          width: '150px',
          height: '150px',
          opacity: logoVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
        }}
      />
      <Typography
        variant="h6"
        sx={{
          opacity: textsVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          mt: 2,
        }}
      >
        Developed By SKLENTR INC.
      </Typography>
      <Typography
        variant="body1"
        sx={{
          opacity: textsVisible ? 1 : 0,
          transition: 'opacity 1s ease-in-out',
          fontSize: '0.8em',
        }}
      >
        Technology Partner AIUB
      </Typography>
    </Box>
  );
};

export default SplashScreen;