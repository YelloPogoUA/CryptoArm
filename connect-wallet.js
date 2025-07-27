import { createWeb3Modal, defaultWagmiConfig } from 'https://unpkg.com/@web3modal/wagmi@3/dist/esm/exports.js';
import { mainnet, bsc } from 'https://unpkg.com/@wagmi/core@1/chains/dist/esm/index.js';
import { getAccount, watchAccount } from 'https://unpkg.com/@wagmi/core@1/dist/esm/actions.js';

document.addEventListener('DOMContentLoaded', () => {
    
    if (!document.body.classList.contains('connect-page')) {
        return;
    }

    const connectButton = document.getElementById('connect-wallet-btn');
    const continueButton = document.getElementById('continue-btn');
    const statusDisplay = document.getElementById('connection-status');
    const iconEl = document.getElementById('network-icon');
    const nameEl = document.getElementById('network-name');
    
    const urlParams = new URLSearchParams(window.location.search);
    const networkParam = urlParams.get('network');
    
    const projectId = '22588377d9f98addb12b2815bce90752'; 

    const metadata = {
        name: 'CryptoArm',
        description: 'Advanced Crypto Wallet Screening',
        url: window.location.host,
        icons: ['https://explorer.walletconnect.com/favicon.ico']
    };

    let selectedChain = mainnet; 
    
    if (networkParam) {
        switch (networkParam) {
            case 'bsc':
                selectedChain = bsc;
                iconEl.src = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png';
                nameEl.textContent = 'USDT BEP-20';
                break;
            case 'eth':
                selectedChain = mainnet;
                iconEl.src = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png';
                nameEl.textContent = 'USDT ERC-20';
                break;
            case 'tron':
                iconEl.src = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1958.png';
                nameEl.textContent = 'TRON Network (Not Supported)';
                statusDisplay.textContent = "TRON network is not supported with this method.";
                statusDisplay.style.color = 'var(--progress-red)';
                connectButton.disabled = true;
                return; 
            default:
                selectedChain = mainnet;
                iconEl.src = 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png';
                nameEl.textContent = 'USDT ERC-20';
                break;
        }
    }

    const chains = [selectedChain];
    const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata });

    // НОВОЕ: Определяем тему для модального окна
    const currentTheme = document.body.dataset.theme || 'dark';

    const modal = createWeb3Modal({
        wagmiConfig,
        projectId,
        chains,
        themeMode: currentTheme, // Используем текущую тему сайта
        themeVariables: {
            '--w3m-color-mix': '#58a6ff',
            '--w3m-accent': '#58a6ff',
            '--w3m-border-radius-master': '16px',
        }
    });

    function updateUi(account) {
        const connectButtonSpan = connectButton.querySelector('span');

        if (account.isConnected && account.address) {
            const shortAddress = `${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4)}`;
            statusDisplay.textContent = `Wallet connected: ${shortAddress}`;
            statusDisplay.style.color = 'var(--progress-green)';
            if (connectButtonSpan) { 
                connectButtonSpan.textContent = 'Connected';
            }
            connectButton.classList.add('btn-success');
            connectButton.disabled = true;
            continueButton.disabled = false;
        } else {
            statusDisplay.textContent = 'Status: Not Connected';
            statusDisplay.style.color = 'var(--text-color-muted)';
            if (connectButtonSpan) { 
                connectButtonSpan.textContent = 'WalletConnect';
            }
            connectButton.classList.remove('btn-success');
            connectButton.disabled = false;
            continueButton.disabled = true;
        }
    }

    connectButton.addEventListener('click', () => modal.open());

    continueButton.addEventListener('click', () => {
        const account = getAccount();
        if (!continueButton.disabled && account.isConnected) {
            console.log('Переход на шаг 3. Адрес кошелька:', account.address);
            // window.location.href = 'step3.html?address=' + account.address; 
        }
    });

    watchAccount(updateUi);
    updateUi(getAccount());
});