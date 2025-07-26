// Импортируем все необходимые библиотеки в начале файла
import { createWeb3Modal, defaultWagmiConfig } from 'https://unpkg.com/@web3modal/wagmi@3/dist/esm/exports.js';
import { mainnet, bsc } from 'https://unpkg.com/@wagmi/core@1/chains/dist/esm/index.js';
import { getAccount, watchAccount } from 'https://unpkg.com/@wagmi/core@1/dist/esm/actions.js';

// Ждем, пока весь HTML-документ будет полностью загружен и готов
document.addEventListener('DOMContentLoaded', () => {
    
    // Проверяем, что мы находимся на нужной странице, чтобы этот код не выполнялся на других страницах
    if (!document.body.classList.contains('connect-page')) {
        return;
    }

    // 1. Получаем все нужные элементы со страницы
    const connectButton = document.getElementById('connect-wallet-btn');
    const continueButton = document.getElementById('continue-btn');
    const statusDisplay = document.getElementById('connection-status');
    const iconEl = document.getElementById('network-icon');
    const nameEl = document.getElementById('network-name');
    
    // 2. Определяем сеть из URL и настраиваем конфигурацию
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

    // 3. Создаем модальное окно
    const modal = createWeb3Modal({
        wagmiConfig,
        projectId,
        chains,
        themeMode: 'dark',
        themeVariables: {
            '--w3m-color-mix': '#62339e',
            '--w3m-accent': '#62339e',
        }
    });

    // 4. Функции для обновления интерфейса
    function updateUi(account) {
        if (account.isConnected && account.address) {
            const shortAddress = `${account.address.substring(0, 6)}...${account.address.substring(account.address.length - 4)}`;
            statusDisplay.textContent = `Wallet connected: ${shortAddress}`;
            statusDisplay.style.color = 'var(--progress-green)';
            connectButton.querySelector('span').textContent = 'Connected';
            connectButton.classList.add('btn-success');
            connectButton.disabled = true;
            continueButton.disabled = false;
        } else {
            statusDisplay.textContent = 'Status: Not Connected';
            statusDisplay.style.color = 'var(--text-color-muted)';
            connectButton.querySelector('span').textContent = 'WalletConnect';
            connectButton.classList.remove('btn-success');
            connectButton.disabled = false;
            continueButton.disabled = true;
        }
    }

    // 5. Назначаем обработчики событий
    connectButton.addEventListener('click', () => modal.open());

    continueButton.addEventListener('click', () => {
        const account = getAccount();
        if (!continueButton.disabled && account.isConnected) {
            console.log('Переход на шаг 3. Адрес кошелька:', account.address);
            // window.location.href = 'step3.html?address=' + account.address; 
        }
    });

    // 6. Следим за изменением статуса подключения и обновляем UI
    watchAccount(updateUi);

    // Инициализация UI при загрузке
    updateUi(getAccount());
});