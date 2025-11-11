import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';

export default function Overlay({ open }: { open: boolean }) {
  return (
    <Backdrop
      sx={{
        color: '#ffffff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
