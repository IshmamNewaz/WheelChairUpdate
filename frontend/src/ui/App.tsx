import { useState, useEffect } from 'react'
import MapWithRoute from './components/mapWithRoute.tsx'
import SplashScreen from './components/SplashScreen.tsx'
import SearchPanel from './components/SearchPanel.tsx'
import ExitConfirmationDialog from './components/ExitConfirmationDialog.tsx'
import L from 'leaflet';
import { Box, Button } from '@mui/material'; // Added Button import
import BatteryDisplay from './components/BatteryDisplay';


declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void;
      };
    };
  }
}

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [userGeolocation, setUserGeolocation] = useState<L.LatLngExpression | null>(null);
  const [fromLocation, setFromLocation] = useState<L.LatLngExpression | null>(null);
  const [toLocation, setToLocation] = useState<L.LatLngExpression | null>(null);
  const [searchResult, setSearchResult] = useState<L.LatLngExpression | null>(null);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [isObjectDetected, setIsObjectDetected] = useState(false); // New state for object detection
  const [speed, setSpeed] = useState(0); // New state for speed
  const [batteryPercentage, setBatteryPercentage] = useState<number>(80); // New state for battery percentage

  const handleAnimationComplete = () => {
    setShowSplash(false);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const userLoc: L.LatLngExpression = [pos.coords.latitude, pos.coords.longitude];
          setUserGeolocation(userLoc);
          setFromLocation(userLoc);
          if (pos.coords.speed !== null) {
            setSpeed(pos.coords.speed); // Update speed from geolocation if available
          }
        },
        err => {
          console.error("Error getting geolocation:", err);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const handleSearchResult = (result: L.LatLngExpression | null) => {
    setSearchResult(result);
  };

  const handleFromLocationSet = (location: L.LatLngExpression | null) => {
    setFromLocation(location);
  };

  const handleToLocationSet = (location: L.LatLngExpression | null) => {
    setToLocation(location);
  };

  const handleExitClick = () => {
    setShowExitDialog(true);
  };

  const handleConfirmExit = () => {
    if (window.electron && window.electron.ipcRenderer) {
      window.electron.ipcRenderer.send('quit-app');
    }
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);
  };

  // Simulate object detection for demonstration
  const toggleObjectDetection = () => {
    setIsObjectDetected(prev => !prev);
  };

  // Simulate speed change for demonstration
  const incrementSpeed = () => {
    setSpeed(prev => (prev >= 100) ? 0 : prev + 10); // Reset to 0 if 100, otherwise increment by 10
  };

  // Simulate battery change for demonstration
  const increaseBattery = () => {
    setBatteryPercentage(prev => Math.min(prev + 10, 100));
  };

  const decreaseBattery = () => {
    setBatteryPercentage(prev => Math.max(prev - 10, 0));
  };


  useEffect(() => {
    console.log('App.tsx State Update:');
    console.log('  userGeolocation:', userGeolocation);
    console.log('  fromLocation (from SearchPanel):', fromLocation);
    console.log('  toLocation (from SearchPanel):', toLocation);
    console.log('  MapWithRoute origin prop:', fromLocation || userGeolocation);
    console.log('  MapWithRoute destination prop:', toLocation);
    console.log('  Object Detected:', isObjectDetected); // Log object detection status
    console.log('  Speed:', speed); // Log speed status
    console.log('  Battery:', batteryPercentage); // Log battery status
  }, [userGeolocation, fromLocation, toLocation, isObjectDetected, speed, batteryPercentage]);

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showSplash ? (
        <SplashScreen onAnimationComplete={handleAnimationComplete} />
      ) : (
        <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
          <Box sx={{ width: '50%', height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2 }}>
              <BatteryDisplay percentage={batteryPercentage} />
            </Box>
            <SearchPanel
              onSearchResult={handleSearchResult}
              onFromLocationSet={handleFromLocationSet}
              onToLocationSet={handleToLocationSet}
              onExitClick={handleExitClick}
              isObjectDetected={isObjectDetected}
              toggleObjectDetection={toggleObjectDetection}
              speed={speed}
              incrementSpeed={incrementSpeed}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 1 }}>
              <Button variant="contained" onClick={increaseBattery}>Increase Battery</Button>
              <Button variant="contained" onClick={decreaseBattery}>Decrease Battery</Button>
            </Box>
          </Box>


          
          <Box sx={{ width: '50%', height: '100%' }}>
            <MapWithRoute
              origin={fromLocation || userGeolocation}
              destination={toLocation}
              searchResult={searchResult}
            />
          </Box>
        </Box>
      )}
      <ExitConfirmationDialog
        isOpen={showExitDialog}
        onConfirm={handleConfirmExit}
        onCancel={handleCancelExit}
      />
    </Box>
  )
}

export default App
