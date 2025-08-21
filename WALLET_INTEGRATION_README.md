# SEI Sentinel Wallet Integration

## Overview

SEI Sentinel now requires wallet connection before accessing any part of the application. This ensures secure access and provides a better user experience with proper authentication flow.

## Features

### 🔐 Wallet Connection Required
- Users must connect either Keplr or MetaMask wallet before accessing the application
- Secure authentication flow with proper error handling
- Persistent wallet connection using localStorage

### 🚀 Enhanced Launch Experience
- Beautiful launch page showcasing SEI Sentinel features
- Smooth transition from launch to wallet connection
- Professional onboarding experience

### 💳 Supported Wallets
- **Keplr Wallet**: Native Sei Network support with chain configuration
- **MetaMask**: Ethereum wallet support for broader accessibility

### 📱 Mobile Responsive
- Optimized for all device sizes
- Touch-friendly interface
- Responsive navigation and layouts

## Implementation Details

### Components

#### WalletGate
- Main component that protects all routes
- Shows launch page first, then wallet connection
- Only renders protected content after wallet connection

#### ConnectWalletButton
- Handles wallet connection logic
- Supports both Keplr and MetaMask
- Provides clear error messages and installation links

#### LaunchPage
- Beautiful landing page before wallet connection
- Showcases application features and benefits
- Smooth transition to wallet connection

#### WalletContext
- Global state management for wallet information
- Persistent wallet connection across page refreshes
- Clean disconnect functionality

### File Structure

```
src/
├── components/
│   ├── WalletGate.tsx          # Main wallet protection component
│   ├── ConnectWalletButton.tsx # Wallet connection interface
│   ├── LaunchPage.tsx          # Launch page component
│   └── Navigation.tsx          # Updated with wallet info
├── contexts/
│   └── WalletContext.tsx       # Wallet state management
└── App.tsx                     # Updated with WalletProvider
```

## User Flow

1. **Launch Page**: Users see a beautiful landing page with app features
2. **Launch Button**: Clicking "Launch Sentinel" proceeds to wallet connection
3. **Wallet Connection**: Users choose between Keplr or MetaMask
4. **Authentication**: Wallet connection is established and verified
5. **Access Granted**: Users can now access all application features

## Security Features

- Wallet connection required for all routes
- Persistent authentication across sessions
- Secure wallet information storage
- Clean disconnect functionality

## Installation & Setup

### Prerequisites
- Keplr wallet extension installed
- MetaMask extension installed (optional)

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm run build
npm run preview
```

## Configuration

### Sei Network Configuration
The application automatically configures Sei Network (Atlantic testnet) in Keplr:
- Chain ID: `atlantic-1`
- RPC: `https://rpc.atlantic-1.seinetwork.io`
- REST: `https://lcd.atlantic-1.seinetwork.io`

### Wallet Storage
Wallet information is stored in localStorage with key: `sei-sentinel-wallet`

## Troubleshooting

### Common Issues

1. **Keplr not installed**
   - Install from Chrome Web Store
   - Refresh page after installation

2. **MetaMask not installed**
   - Install from metamask.io
   - Refresh page after installation

3. **Connection failed**
   - Check wallet permissions
   - Ensure wallet is unlocked
   - Try refreshing the page

### Error Messages

- "Keplr wallet is not installed" → Install Keplr extension
- "MetaMask is not installed" → Install MetaMask extension
- "Failed to connect wallet" → Check wallet permissions and try again

## Future Enhancements

- [ ] Support for additional wallets (WalletConnect, etc.)
- [ ] Multi-chain support beyond Sei Network
- [ ] Enhanced security features
- [ ] Wallet connection analytics
- [ ] Social login integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
