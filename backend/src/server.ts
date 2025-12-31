import app from './app';

const PORT = process.env.PORT || 3000;

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
