import React, { useState, useCallback } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Button, Box, Typography } from '@mui/material';
import L from 'leaflet';

interface SearchPanelProps {
  onFromLocationSet: (location: L.LatLngExpression | null) => void;
  onToLocationSet: (location: L.LatLngExpression | null) => void;
  onSearchResult: (result: L.LatLngExpression | null) => void;
  onExitClick: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ onFromLocationSet, onToLocationSet, onSearchResult, onExitClick }) => {
  const [showRoutePanel, setShowRoutePanel] = useState<boolean>(false);
  const [fromSearchTerm, setFromSearchTerm] = useState<string>('');
  const [toSearchTerm, setToSearchTerm] = useState<string>('');

  const geocodeAddress = async (address: string): Promise<L.LatLngExpression | null> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        return [lat, lon];
      } else {
        console.error('No results found for:', address);
        return null;
      }
    } catch (error) {
      console.error('Error during geocoding:', error);
      return null;
    }
  };

  const handleShowRoute = useCallback(async () => {
    let fromLocation: L.LatLngExpression | null = null;
    if (fromSearchTerm) {
      fromLocation = await geocodeAddress(fromSearchTerm);
    }

    let toLocation: L.LatLngExpression | null = null;
    if (toSearchTerm) {
      toLocation = await geocodeAddress(toSearchTerm);
    }

    onFromLocationSet(fromLocation);
    onToLocationSet(toLocation);
    onSearchResult(toLocation); // For map centering
    console.log('SearchPanel: fromLocation geocoded:', fromLocation);
    console.log('SearchPanel: toLocation geocoded:', toLocation);

  }, [fromSearchTerm, toSearchTerm, onFromLocationSet, onToLocationSet, onSearchResult]);

  return (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%', width: '100%', boxSizing: 'border-box', overflowY: 'auto' }}>
      {showRoutePanel ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              Find Your Route
            </Typography>
            <IconButton onClick={() => setShowRoutePanel(false)} color="inherit" sx={{ color: 'white' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            label="From (e.g., Current Location)"
            variant="outlined"
            fullWidth
            value={fromSearchTerm}
            onChange={(e) => setFromSearchTerm(e.target.value)}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'red',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
            }}
          />
          <TextField
            label="To (Destination)"
            variant="outlined"
            fullWidth
            value={toSearchTerm}
            onChange={(e) => setToSearchTerm(e.target.value)}
            sx={{
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'white',
                },
                '&:hover fieldset': {
                  borderColor: 'white',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'red',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'white',
              },
              '& .MuiInputBase-input': {
                color: 'white',
              },
              
            }}
          />
          <Button variant="contained" onClick={handleShowRoute} sx={{ mb: 3 }}>
            Show Route
          </Button>
        </>
      ) : (
        <Button variant="contained" onClick={() => setShowRoutePanel(true)} sx={{ mb: 3 }}>
          Use Map
        </Button>
      )}
      <Box sx={{ mt: 'auto' }}>
        <Button variant="contained" color="error" onClick={onExitClick} fullWidth>
          Exit App
        </Button>
      </Box>
    </Box>
  );
};

export default SearchPanel;