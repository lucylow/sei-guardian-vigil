module.exports = {
  projectType: 'vite-react',
  buildCommand: 'npm run build',
  outputDirectory: 'dist',
  entryPoint: 'src/main.tsx',
  framework: 'vite',
  bundler: 'vite',
  plugins: ['lovable-tagger'],
  buildOptions: {
    mode: 'production',
    sourcemap: false,
    minify: true,
  },
  dependencies: {
    required: ['react', 'react-dom', 'vite'],
    optional: ['typescript', '@types/react', '@types/react-dom']
  }
};
