export function initPopups() {
        
    const popupLinks = document.querySelectorAll('.popup__link');
    const body = document.querySelector('body');
    const timeout = 400;
    let unlock = true;

    const isAuthenticated = () => {
        return localStorage.getItem('jwt') !== null;
    };

    if (popupLinks.length > 0) {
        for(let i = 0; i < popupLinks.length; i++) {
          const popupLink = popupLinks[i];
          popupLink.addEventListener('click', function(e) {
            // Если требуется авторизация и пользователь не авторизован
            if (handleAuthRedirect(popupLink)) {
              e.preventDefault();
              return;
            }
            
            const popupName = popupLink.getAttribute('href').replace('#', '');
            const curentPopup = document.getElementById(popupName);
            popupOpen(curentPopup);
            e.preventDefault();
          });
        }
      }

    const checkAuth = () => {
        return localStorage.getItem('jwt') !== null;
    };
    
    const handleAuthRedirect = (popupLink) => {
        if (popupLink.dataset.requireAuth === 'true' && !checkAuth()) {
            popupOpen(document.getElementById('Auth'));
            return true;
        }
        return false;
    };  
    
    const logout = () => {
    localStorage.removeItem('jwt');
    document.querySelectorAll('.module.open').forEach(popup => {
        popup.classList.remove('open');
        const popupOpen = document.getElementById('Auth')
        popupOpen.classList.add('open');
    });
    };

    const logoutButtons = document.querySelectorAll('[data-logout]');
    logoutButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    });

    const popupCancelButton = document.querySelectorAll('.edit_cancel');
    const popupConfirmButton = document.querySelectorAll('.edit_confirm');
    if (popupCancelButton.length > 0) {
        for (let i = 0; i < popupCancelButton.length; i++) {
            const el = popupCancelButton[i];
            const curentPopup = document.getElementById('Account');
            el.addEventListener('click', function (e) {
                popupClose(el.closest('.module'));
                curentPopup.classList.add('open');
                e.preventDefault();
            });
        }
    }
    if (popupConfirmButton.length > 0) {
        for (let i = 0; i < popupConfirmButton.length; i++) {
            const el = popupConfirmButton[i];
            const curentPopup = document.getElementById('Account');
            el.addEventListener('click', function (e) {
                popupClose(el.closest('.module'));
                curentPopup.classList.add('open');
                e.preventDefault();
            });
        }
    }

    function popupOpen(curentPopup) {
        if (curentPopup && unlock) {
            const moduleActive = document.querySelector('.module.open');
            if (moduleActive) {
                popupClose(moduleActive, false);
            }
            else {
                bodyLock();
            }
            curentPopup.classList.add('open');
        }
    }

    function popupClose(moduleActive, doUnlock = true) {
        if (unlock) {
            moduleActive.classList.remove('open');
            if (doUnlock) {
                bodyUnlock();
            }
        }
    }

    function bodyLock() {
        body.classList.add('lock');
        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    function bodyUnlock() {
        body.classList.remove('lock');
        unlock = false;
        setTimeout(function () {
            unlock = true;
        }, timeout);
    }

    const accountContainers = document.querySelectorAll('.account__container');
    accountContainers.forEach(cont => {
      cont.addEventListener('mouseenter', () => {
        const angle = 3;
        const direction = Math.random() < 0.5 ? -1 : 1;
        cont.style.transform = 'rotate(${direction * angle}deg)';
      });
      cont.addEventListener('mouseleave', () => {
        cont.style.transform = 'rotate(0deg)';
      });
    });
}
