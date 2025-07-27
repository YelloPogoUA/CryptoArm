document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM Content Loaded. Checking for connect-page class...');
    
    if (!document.body.classList.contains('connect-page')) {
        console.log('Not on connect page, exiting initialization');
        return;
    }

    console.log('Initializing wallet connection on connect page');
    
    const connectButton = document.getElementById('connect-wallet-btn');
    const continueButton = document.getElementById('continue-btn');
    const statusDisplay = document.getElementById('connection-status');
    const iconEl = document.getElementById('network-icon');
    const nameEl = document.getElementById('network-name');
    
    if (!connectButton || !continueButton || !statusDisplay) {
        console.error('Required DOM elements not found');
        return;
    }

    // Загружаем необходимые библиотеки динамически
    try {
        // Загружаем необходимые скрипты
        await loadScript('https://unpkg.com/viem@1.20.0/dist/index.umd.js');
        await loadScript('https://unpkg.com/@wagmi/core@1.4.13/dist/index.umd.js');
        await loadScript('https://unpkg.com/@web3modal/wagmi@3.5.2/dist/index.umd.js');
        
        console.log('All libraries loaded successfully');
        
        const urlParams = new URLSearchParams(window.location.search);
        const networkParam = urlParams.get('network');
        
        // Используем публичный projectId для тестирования
        const projectId = '22588377d9f98addb12b2815bce90752'; 

        const metadata = {
            name: 'CryptoArm',
            description: 'Advanced Crypto Wallet Screening',
            url: window.location.origin,
            icons: ['https://explorer.walletconnect.com/favicon.ico']
        };

        // Определяем доступные сети
        const mainnet = {
            id: 1,
            name: 'Ethereum',
            network: 'homestead',
            nativeCurrency: {
                name: 'Ether',
                symbol: 'ETH',
                decimals: 18,
            },
            rpcUrls: {
                default: { http: ['https://eth.llamarpc.com'] },
                public: { http: ['https://eth.llamarpc.com'] },
            }
        };
        
        const bsc = {
            id: 56,
            name: 'BNB Smart Chain',
            network: 'bsc',
            nativeCurrency: {
                name: 'BNB',
                symbol: 'BNB',
                decimals: 18,
            },
            rpcUrls: {
                default: { http: ['https://bsc-dataseed1.binance.org'] },
                public: { http: ['https://bsc-dataseed1.binance.org'] },
            }
        };

        let selectedChain = mainnet; 
        
        if (networkParam) {
            console.log('Network parameter found:', networkParam);
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

        console.log('Selected chain:', selectedChain.name);
        
        const chains = [selectedChain];
        
        console.log('Creating wagmiConfig...');
        const wagmiConfig = window.wagmi.createConfig({
            chains,
            projectId,
            metadata
        });
        console.log('wagmiConfig created');

        // Определяем тему для модального окна
        const currentTheme = document.body.dataset.theme || 'dark';
        console.log('Current theme:', currentTheme);

        console.log('Creating Web3Modal...');
        const modal = window.w3m.createWeb3Modal({
            wagmiConfig,
            projectId,
            chains,
            themeMode: currentTheme,
            themeVariables: {
                '--w3m-color-mix': '#58a6ff',
                '--w3m-accent': '#58a6ff',
                '--w3m-border-radius-master': '16px',
            }
        });
        
        console.log('Web3Modal created successfully');

        function updateUi(account) {
            console.log('Updating UI with account:', account);
            const connectButtonSpan = connectButton.querySelector('span') || connectButton;

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

        console.log('Adding event listeners to buttons');
        connectButton.addEventListener('click', () => {
            console.log('Connect button clicked, opening modal');
            try {
                modal.open();
            } catch (error) {
                console.error('Error opening modal:', error);
                statusDisplay.textContent = "Error opening wallet connection dialog";
                statusDisplay.style.color = 'var(--progress-red)';
            }
        });

        continueButton.addEventListener('click', () => {
            const account = window.wagmi.getAccount();
            console.log('Continue button clicked, account:', account);
            if (!continueButton.disabled && account.isConnected) {
                console.log('Переход на шаг 3. Адрес кошелька:', account.address);
                // window.location.href = 'step3.html?address=' + account.address; 
            }
        });

        console.log('Setting up account watcher');
        window.wagmi.watchAccount(updateUi);
        
        console.log('Initial UI update');
        updateUi(window.wagmi.getAccount());
        
    } catch (error) {
        console.error('Error initializing Web3Modal:', error);
        statusDisplay.textContent = "Error initializing wallet connection: " + error.message;
        statusDisplay.style.color = 'var(--progress-red)';
    }
});

// Функция для асинхронной загрузки скриптов
function loadScript(url) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}