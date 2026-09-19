document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // ELEMENTOS GLOBALES
    // ----------------------------------------------------
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePwdBtn = document.getElementById('toggle-pwd');
    const loginScreen = document.getElementById('login-screen');
    const dashboardScreen = document.getElementById('dashboard-screen');
    const displayUsername = document.getElementById('display-username');
    const avatarInitial = document.getElementById('avatar-initial');
    const logoutBtn = document.getElementById('logout-btn');
    const notification = document.getElementById('notification');
    
    // Vistas
    const welcomeView = document.getElementById('view-welcome');
    const configParqueaderosView = document.getElementById('view-config-parqueaderos');
    const configZonasView = document.getElementById('view-config-zonas');
    const genericView = document.getElementById('view-generic');
    
    // Elementos de Parqueaderos
    const tableBody = document.getElementById('table-body');
    const paginationContainer = document.getElementById('pagination-container');
    const btnNew = document.getElementById('btn-new');
    const btnSearch = document.getElementById('btn-search');
    const btnClearSearch = document.getElementById('btn-clear-search');
    const searchCampo = document.getElementById('search-campo');
    const searchValor = document.getElementById('search-valor');
    const formPanel = document.getElementById('edit-form-panel');

    // Elementos de Zonas
    const tableBodyZona = document.getElementById('table-body-zona');
    const paginationContainerZona = document.getElementById('pagination-container-zona');
    const btnNewZona = document.getElementById('btn-new-zona');
    const btnSearchZona = document.getElementById('btn-search-zona');
    const btnClearSearchZona = document.getElementById('btn-clear-search-zona');
    const searchCampoZona = document.getElementById('search-campo-zona');
    const searchValorZona = document.getElementById('search-valor-zona');
    const formPanelZona = document.getElementById('edit-form-panel-zona');
    const formParqueaderoZona = document.getElementById('form-parqueadero-zona');
    
    // ----------------------------------------------------
    // ESTADO DE DATOS (Simulación de Base de Datos)
    // ----------------------------------------------------
    let parqueaderosDB = [
        { codigo: '0', nombre: 'SERVIDOR ADMINISTRACION', direccion: 'OFICINA', estado: true, tipoEquipos: 'Meypar', vip: false },
        { codigo: '24', nombre: 'SERVIDOR AEROPUERTO', direccion: 'Avenida de las Américas S/N', estado: true, tipoEquipos: 'TGW', vip: true },
        { codigo: '500', nombre: 'SERVIDOR AUTOPARK', direccion: 'Centro Histórico', estado: false, tipoEquipos: 'Meypar', vip: false },
        { codigo: '697', nombre: 'SERVIDOR C.C. CONDADO SHOPPING', direccion: 'Av. Mariscal Sucre', estado: true, tipoEquipos: 'Meypar', vip: false },
        { codigo: '381', nombre: 'SERVIDOR C.C. EL BOSQUE', direccion: 'Av. del Parque', estado: true, tipoEquipos: 'TGW', vip: true },
        { codigo: '402', nombre: 'SERVIDOR C.C. QUICENTRO SUR', direccion: 'Quitumbe', estado: true, tipoEquipos: 'Meypar', vip: false },
        { codigo: '115', nombre: 'SERVIDOR HOSPITAL METROPOLITANO', direccion: 'Mariana de Jesús', estado: true, tipoEquipos: 'TGW', vip: true },
        { codigo: '88', nombre: 'SERVIDOR ZONA AZUL CAROLINA', direccion: 'La Carolina', estado: true, tipoEquipos: 'Meypar', vip: false },
        { codigo: '290', nombre: 'SERVIDOR PLAZA FOCH', direccion: 'Mariscal Foch y Reina Victoria', estado: false, tipoEquipos: 'Meypar', vip: false },
        { codigo: '101', nombre: 'SERVIDOR TERMINAL TERRESTRE', direccion: 'Terminal Carcelén', estado: true, tipoEquipos: 'TGW', vip: false },
        { codigo: '55', nombre: 'SERVIDOR UNIVERSIDAD CENTRAL', direccion: 'Av. Universitaria', estado: true, tipoEquipos: 'Meypar', vip: false },
        { codigo: '77', nombre: 'SERVIDOR PARQUE BICENTENARIO', direccion: 'Antiguo Aeropuerto', estado: true, tipoEquipos: 'TGW', vip: false }
    ];
    
    let filteredData = [...parqueaderosDB];
    let currentPage = 1;
    const itemsPerPage = 5;
    let editingId = null; // null = creando nuevo, string = editando existente

    let zonasDB = [
        { id: 'z1', codigo: '1', parqueadero: 'SERVIDOR ADMINISTRACION', nombre: 'ADMINISTRACION', ip: '', assignedCode: '', estado: true },
        { id: 'z2', codigo: '1', parqueadero: 'SERVIDOR AEROPUERTO', nombre: 'AEROPUERTO', ip: '', assignedCode: '', estado: true },
        { id: 'z3', codigo: '3', parqueadero: 'SERVIDOR AEROPUERTO', nombre: 'AEROPUERTO EMPLEADOS', ip: '', assignedCode: '', estado: true },
        { id: 'z4', codigo: '2', parqueadero: 'SERVIDOR AEROPUERTO', nombre: 'AEROPUERTO R. CUBIERTO', ip: '', assignedCode: '', estado: true },
        { id: 'z5', codigo: '5', parqueadero: 'SERVIDOR AEROPUERTO', nombre: 'AEROPUERTO R. GENERAL', ip: '', assignedCode: '', estado: true }
    ];
    let filteredZonas = [...zonasDB];
    let currentZonaPage = 1;
    let editingZonaId = null;

    // ----------------------------------------------------
    // LOGIN & LOGOUT
    // ----------------------------------------------------
    if (togglePwdBtn) {
        togglePwdBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = togglePwdBtn.querySelector('i');
            icon.className = type === 'text' ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = usernameInput.value.trim();
            if (username && passwordInput.value) {
                const btn = loginForm.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Validando...';
                btn.disabled = true;
                
                setTimeout(() => {
                    if (displayUsername) displayUsername.textContent = username;
                    if (avatarInitial) avatarInitial.textContent = username.charAt(0).toUpperCase();
                    loginScreen.classList.remove('active');
                    setTimeout(() => {
                        loginScreen.classList.add('hidden');
                        dashboardScreen.classList.remove('hidden');
                        setTimeout(() => {
                            dashboardScreen.classList.add('active');
                            showNotification(`¡Bienvenido de nuevo, ${username}!`);
                        }, 50);
                    }, 300);
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    loginForm.reset();
                }, 800);
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            dashboardScreen.classList.remove('active');
            setTimeout(() => {
                dashboardScreen.classList.add('hidden');
                loginScreen.classList.remove('hidden');
                setTimeout(() => {
                    loginScreen.classList.add('active');
                    showNotification('Sesión cerrada exitosamente');
                }, 50);
            }, 300);
        });
    }

    // ----------------------------------------------------
    // NOTIFICACIONES
    // ----------------------------------------------------
    window.showNotification = function(message, isError = false) {
        notification.textContent = message;
        notification.style.backgroundColor = isError ? 'var(--danger)' : 'var(--success)';
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    // ----------------------------------------------------
    // ----------------------------------------------------
    // NAVEGACIÓN ENTRE MÓDULOS
    // ----------------------------------------------------
    window.showModule = function(moduleName) {
        document.activeElement.blur();
        
        // Actualizar estado activo en sidebar
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(`showModule('${moduleName}')`)) {
                link.classList.add('active');
            }
        });
        
        // Ocultar todas las vistas
        const dashboardView = document.getElementById('view-dashboard');
        if(dashboardView) dashboardView.style.display = 'none';
        
        const welcomeView = document.getElementById('view-welcome');
        if(welcomeView) welcomeView.style.display = 'none';
        
        configParqueaderosView.style.display = 'none';
        if(configZonasView) configZonasView.style.display = 'none';
        const configTarifasView = document.getElementById('view-config-tarifas');
        if(configTarifasView) configTarifasView.style.display = 'none';
        const recargaEfectivoView = document.getElementById('view-recarga-efectivo');
        if(recargaEfectivoView) recargaEfectivoView.style.display = 'none';
        const codigosPromocionalesView = document.getElementById('view-codigos-promocionales');
        if(codigosPromocionalesView) codigosPromocionalesView.style.display = 'none';
        const catalogosView = document.getElementById('view-catalogos');
        if(catalogosView) catalogosView.style.display = 'none';
        genericView.style.display = 'none';
        
        if (moduleName === 'Dashboard General') {
            if(dashboardView) dashboardView.style.display = 'block';
            showNotification(`Módulo de Dashboard cargado`);
        } else if (moduleName === 'Configuración Parqueaderos') {
            configParqueaderosView.style.display = 'block';
            renderTable();
            showNotification(`Módulo de ${moduleName} cargado`);
        } else if (moduleName === 'Configuración Zonas') {
            if(configZonasView) configZonasView.style.display = 'block';
            renderZonaTable();
            populateParqueaderosSelect();
            showNotification(`Módulo de ${moduleName} cargado`);
        } else if (moduleName === 'Configuración Tarifas') {
            if(configTarifasView) configTarifasView.style.display = 'block';
            if(window.populateTarifasSelects) window.populateTarifasSelects();
            if(window.renderTarifaTable) window.renderTarifaTable();
            showNotification(`Módulo de ${moduleName} cargado`);
        } else if (moduleName === 'Recarga en Efectivo') {
            if(recargaEfectivoView) recargaEfectivoView.style.display = 'block';
            showNotification(`Módulo de ${moduleName} cargado`);
        } else if (moduleName === 'Códigos Promocionales' || moduleName.includes('Promocionales')) {
            if(codigosPromocionalesView) codigosPromocionalesView.style.display = 'block';
            showNotification(`Módulo de ${moduleName} cargado`);
        } else if (moduleName === 'Catálogos y Configuración' || moduleName.includes('Catálogos')) {
            if(catalogosView) catalogosView.style.display = 'block';
            showNotification(`Módulo de ${moduleName} cargado`);
        } else {
            // Módulo Genérico Simulado
            genericView.style.display = 'block';
            document.getElementById('generic-title').textContent = moduleName;
            
            // Simular contenido distinto según el módulo
            const statsContainer = document.getElementById('generic-stats');
            const contentContainer = document.getElementById('generic-content');
            
            if (moduleName.includes('Pruebas')) {
                document.getElementById('generic-desc').textContent = 'Entorno de validación y testeo de integraciones';
                statsContainer.innerHTML = `
                    <div class="stat-card"><div class="stat-icon"><i class="fa-solid fa-bug"></i></div><div class="stat-details"><h3>12</h3><p>Tests Fallidos</p></div></div>
                    <div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-check-double"></i></div><div class="stat-details"><h3>145</h3><p>Tests Exitosos</p></div></div>
                `;
                contentContainer.innerHTML = `<i class="fa-solid fa-flask" style="font-size: 4rem; color: var(--accent-primary); opacity: 0.5;"></i><h3>Consola de Pruebas</h3><p>Simulando peticiones al servidor...</p><button class="btn-primary" onclick="showNotification('Prueba ejecutada')">Ejecutar Test</button>`;
            } 
            else if (moduleName.includes('Tarifas') || moduleName.includes('Recarga')) {
                document.getElementById('generic-desc').textContent = 'Gestión financiera y configuración monetaria';
                statsContainer.innerHTML = `
                    <div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-sack-dollar"></i></div><div class="stat-details"><h3>$4,520</h3><p>Recaudación Hoy</p></div></div>
                    <div class="stat-card"><div class="stat-icon alert"><i class="fa-solid fa-clock-rotate-left"></i></div><div class="stat-details"><h3>15</h3><p>Recargas Pendientes</p></div></div>
                `;
                contentContainer.innerHTML = `<i class="fa-solid fa-chart-line" style="font-size: 4rem; color: var(--success); opacity: 0.5;"></i><h3>Reporte Financiero</h3><p>Cargando gráficos interactivos de ingresos...</p>`;
            }
            else {
                document.getElementById('generic-desc').textContent = 'Panel de administración general';
                statsContainer.innerHTML = `
                    <div class="stat-card"><div class="stat-icon"><i class="fa-solid fa-users"></i></div><div class="stat-details"><h3>84</h3><p>Usuarios Activos</p></div></div>
                    <div class="stat-card"><div class="stat-icon success"><i class="fa-solid fa-server"></i></div><div class="stat-details"><h3>99.9%</h3><p>Uptime Sistema</p></div></div>
                `;
                contentContainer.innerHTML = `<i class="fa-solid fa-network-wired" style="font-size: 4rem; color: var(--accent-primary); opacity: 0.5;"></i><h3>Panel Central</h3><p>Monitorización en tiempo real del sistema.</p>`;
            }
            
            showNotification(`Módulo de ${moduleName} cargado`);
        }
    };

    // ----------------------------------------------------
    // LÓGICA DE PARQUEADEROS (CRUD)
    // ----------------------------------------------------
    
    function renderTable() {
        tableBody.innerHTML = '';
        
        // Paginación
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        if (currentPage > totalPages) currentPage = totalPages || 1;
        
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = filteredData.slice(start, end);
        
        if (pageData.length === 0) {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No se encontraron resultados</td></tr>`;
        } else {
            pageData.forEach(item => {
                const estadoHtml = item.estado 
                    ? `<span style="color: var(--success); background: rgba(16,185,129,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">ACTIVO</span>`
                    : `<span style="color: var(--danger); background: rgba(239,68,68,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">INACTIVO</span>`;
                    
                const equipBadgeClass = item.tipoEquipos === 'TGW' ? 'badge primary' : 'badge';
                const equipHtml = `<span class="${equipBadgeClass}">${item.tipoEquipos || 'Meypar'}</span>`;
                
                const vipHtml = item.vip 
                    ? `<i class="fa-solid fa-crown" style="color: var(--warning); font-size: 1.1rem;" title="Configuración VIP"></i>`
                    : `<span style="color: var(--text-muted);">-</span>`;
                    
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="col-action">
                        <button class="btn-icon-action" onclick="editParqueadero('${item.codigo}')" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </td>
                    <td>${item.codigo}</td>
                    <td><strong>${item.nombre}</strong></td>
                    <td><span class="text-muted">${item.direccion || '-'}</span></td>
                    <td>${equipHtml}</td>
                    <td style="text-align: center;">${vipHtml}</td>
                    <td>${estadoHtml}</td>
                    <td class="col-action">
                        <button class="btn-icon-action" onclick="deleteParqueadero('${item.codigo}')" style="color: var(--danger);" title="Eliminar">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                `;
                tableBody.appendChild(tr);
            });
        }
        
        renderPagination(totalPages);
    }
    
    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';
        if (totalPages <= 1) return;
        
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                currentPage = i;
                renderTable();
            };
            paginationContainer.appendChild(btn);
        }
    }

    // Buscador
    if (btnSearch) {
        btnSearch.addEventListener('click', () => {
            const campo = searchCampo.value;
            const valor = searchValor.value.toLowerCase();
            
            if (!valor) {
                filteredData = [...parqueaderosDB];
            } else {
                filteredData = parqueaderosDB.filter(item => {
                    if (campo === 'codigo') return item.codigo.toLowerCase().includes(valor);
                    if (campo === 'nombre') return item.nombre.toLowerCase().includes(valor);
                    // si es 'todos'
                    return item.codigo.toLowerCase().includes(valor) || 
                           item.nombre.toLowerCase().includes(valor) || 
                           (item.direccion && item.direccion.toLowerCase().includes(valor));
                });
            }
            currentPage = 1;
            renderTable();
            
            // Efecto visual en el botón
            btnSearch.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            setTimeout(() => { btnSearch.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Buscar'; }, 300);
        });
    }

    if (btnClearSearch) {
        btnClearSearch.addEventListener('click', () => {
            searchValor.value = '';
            searchCampo.value = 'todos';
            filteredData = [...parqueaderosDB];
            currentPage = 1;
            renderTable();
        });
    }

    // Nuevo Parqueadero
    if (btnNew) {
        btnNew.addEventListener('click', () => {
            editingId = null;
            document.getElementById('form-codigo').value = '';
            document.getElementById('form-nombre').value = '';
            document.getElementById('form-direccion').value = '';
            document.getElementById('form-equipos').value = 'Meypar';
            document.getElementById('form-vip').checked = false;
            document.getElementById('form-estado').checked = true;
            document.getElementById('form-codigo').disabled = false; // Permitir escribir código
            
            formPanel.style.display = 'block';
            formPanel.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }

    // Funciones Globales para los botones generados dinámicamente
    window.editParqueadero = function(codigo) {
        const item = parqueaderosDB.find(p => p.codigo === codigo);
        if (!item) return;
        
        editingId = codigo;
        document.getElementById('form-codigo').value = item.codigo;
        document.getElementById('form-codigo').disabled = true; // No permitir cambiar código al editar
        document.getElementById('form-nombre').value = item.nombre;
        document.getElementById('form-direccion').value = item.direccion || '';
        document.getElementById('form-equipos').value = item.tipoEquipos || 'Meypar';
        document.getElementById('form-vip').checked = item.vip || false;
        document.getElementById('form-estado').checked = item.estado;
        
        formPanel.style.display = 'block';
        formPanel.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    
    window.deleteParqueadero = function(codigo) {
        if(confirm(`¿Estás seguro de eliminar el parqueadero con código ${codigo}? Esta acción es simulada.`)) {
            parqueaderosDB = parqueaderosDB.filter(p => p.codigo !== codigo);
            // Re-aplicar filtro actual
            btnSearch.click(); 
            showNotification('Parqueadero eliminado');
        }
    };
    
    window.closeForm = function() {
        formPanel.style.display = 'none';
        editingId = null;
    };
    
    window.saveForm = function() {
        const codigo = document.getElementById('form-codigo').value.trim();
        const nombre = document.getElementById('form-nombre').value.trim();
        const direccion = document.getElementById('form-direccion').value.trim();
        const tipoEquipos = document.getElementById('form-equipos').value;
        const vip = document.getElementById('form-vip').checked;
        const estado = document.getElementById('form-estado').checked;
        
        if (!codigo || !nombre) {
            showNotification('El Código y Nombre son obligatorios', true);
            return;
        }
        
        if (editingId) {
            // Actualizar existente
            const index = parqueaderosDB.findIndex(p => p.codigo === editingId);
            if (index !== -1) {
                parqueaderosDB[index] = { ...parqueaderosDB[index], nombre, direccion, tipoEquipos, vip, estado };
                showNotification('Datos actualizados exitosamente');
            }
        } else {
            // Crear nuevo
            if (parqueaderosDB.some(p => p.codigo === codigo)) {
                showNotification('El código ingresado ya existe', true);
                return;
            }
            parqueaderosDB.unshift({ codigo, nombre, direccion, tipoEquipos, vip, estado });
            showNotification('Nuevo parqueadero creado');
        }
        
        closeForm();
        btnSearch.click(); // Refrescar tabla con filtros
    };

    // ----------------------------------------------------
    // LÓGICA DE ZONAS (CRUD)
    // ----------------------------------------------------
    function renderZonaTable() {
        if(!tableBodyZona) return;
        tableBodyZona.innerHTML = '';
        
        const totalPages = Math.ceil(filteredZonas.length / itemsPerPage);
        if (currentZonaPage > totalPages) currentZonaPage = totalPages || 1;
        
        const start = (currentZonaPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const pageData = filteredZonas.slice(start, end);
        
        if (pageData.length === 0) {
            tableBodyZona.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No se encontraron zonas</td></tr>`;
        } else {
            pageData.forEach(item => {
                const estadoHtml = item.estado 
                    ? `<span style="color: var(--success); background: rgba(16,185,129,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">ACTIVO</span>`
                    : `<span style="color: var(--danger); background: rgba(239,68,68,0.1); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">INACTIVO</span>`;
                    
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="col-action">
                        <button class="btn-icon-action" onclick="editZona('${item.id}')" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </td>
                    <td>${item.codigo}</td>
                    <td><span class="text-muted">${item.parqueadero}</span></td>
                    <td><strong>${item.nombre}</strong></td>
                    <td>${estadoHtml}</td>
                    <td class="col-action">
                        <button class="btn-icon-action" onclick="deleteZona('${item.id}')" style="color: var(--danger);" title="Eliminar">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                `;
                tableBodyZona.appendChild(tr);
            });
        }
        renderZonaPagination(totalPages);
    }
    
    function renderZonaPagination(totalPages) {
        if(!paginationContainerZona) return;
        paginationContainerZona.innerHTML = '';
        if (totalPages <= 1) return;
        
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement('button');
            btn.className = `page-btn ${i === currentZonaPage ? 'active' : ''}`;
            btn.textContent = i;
            btn.onclick = () => {
                currentZonaPage = i;
                renderZonaTable();
            };
            paginationContainerZona.appendChild(btn);
        }
    }
    
    function populateParqueaderosSelect() {
        if(!formParqueaderoZona) return;
        formParqueaderoZona.innerHTML = '';
        parqueaderosDB.forEach(p => {
            const option = document.createElement('option');
            option.value = p.nombre;
            option.textContent = p.nombre;
            formParqueaderoZona.appendChild(option);
        });
    }

    if (btnSearchZona) {
        btnSearchZona.addEventListener('click', () => {
            const campo = searchCampoZona.value;
            const valor = searchValorZona.value.toLowerCase();
            
            if (!valor) {
                filteredZonas = [...zonasDB];
            } else {
                filteredZonas = zonasDB.filter(item => {
                    if (campo === 'codigo') return item.codigo.toLowerCase().includes(valor);
                    if (campo === 'parqueadero') return item.parqueadero.toLowerCase().includes(valor);
                    if (campo === 'nombre') return item.nombre.toLowerCase().includes(valor);
                    return item.codigo.toLowerCase().includes(valor) || 
                           item.parqueadero.toLowerCase().includes(valor) || 
                           item.nombre.toLowerCase().includes(valor);
                });
            }
            currentZonaPage = 1;
            renderZonaTable();
            
            btnSearchZona.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            setTimeout(() => { btnSearchZona.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Buscar'; }, 300);
        });
    }

    if (btnClearSearchZona) {
        btnClearSearchZona.addEventListener('click', () => {
            searchValorZona.value = '';
            searchCampoZona.value = 'todos';
            filteredZonas = [...zonasDB];
            currentZonaPage = 1;
            renderZonaTable();
        });
    }

    if (btnNewZona) {
        btnNewZona.addEventListener('click', () => {
            editingZonaId = null;
            document.getElementById('form-codigo-zona').value = '';
            document.getElementById('form-nombre-zona').value = '';
            document.getElementById('form-ip-zona').value = '';
            document.getElementById('form-assigned-zona').value = '';
            document.getElementById('form-estado-zona').checked = true;
            if(parqueaderosDB.length > 0) formParqueaderoZona.value = parqueaderosDB[0].nombre;
            
            formPanelZona.style.display = 'block';
            formPanelZona.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }

    window.editZona = function(id) {
        const item = zonasDB.find(z => z.id === id);
        if (!item) return;
        
        editingZonaId = id;
        document.getElementById('form-codigo-zona').value = item.codigo;
        document.getElementById('form-nombre-zona').value = item.nombre;
        formParqueaderoZona.value = item.parqueadero;
        document.getElementById('form-ip-zona').value = item.ip || '';
        document.getElementById('form-assigned-zona').value = item.assignedCode || '';
        document.getElementById('form-estado-zona').checked = item.estado;
        
        formPanelZona.style.display = 'block';
        formPanelZona.scrollIntoView({ behavior: 'smooth', block: 'end' });
    };
    
    window.deleteZona = function(id) {
        if(confirm(`¿Estás seguro de eliminar esta zona? Esta acción es simulada.`)) {
            zonasDB = zonasDB.filter(z => z.id !== id);
            btnSearchZona.click(); 
            showNotification('Zona eliminada');
        }
    };
    
    window.closeFormZona = function() {
        formPanelZona.style.display = 'none';
        editingZonaId = null;
    };
    
    window.saveFormZona = function() {
        const codigo = document.getElementById('form-codigo-zona').value.trim();
        const nombre = document.getElementById('form-nombre-zona').value.trim();
        const parqueadero = formParqueaderoZona.value;
        const ip = document.getElementById('form-ip-zona').value.trim();
        const assignedCode = document.getElementById('form-assigned-zona').value.trim();
        const estado = document.getElementById('form-estado-zona').checked;
        
        if (!codigo || !nombre) {
            showNotification('El Código y Nombre son obligatorios', true);
            return;
        }
        
        if (editingZonaId) {
            const index = zonasDB.findIndex(z => z.id === editingZonaId);
            if (index !== -1) {
                zonasDB[index] = { ...zonasDB[index], codigo, nombre, parqueadero, ip, assignedCode, estado };
                showNotification('Zona actualizada exitosamente');
            }
        } else {
            const newId = 'z' + Date.now();
            zonasDB.unshift({ id: newId, codigo, nombre, parqueadero, ip, assignedCode, estado });
            showNotification('Nueva zona creada');
        }
        
        closeFormZona();
        btnSearchZona.click();
    };

    // ----------------------------------------------------
    // LÓGICA DE TARIFAS (CRUD & ACCORDION)
    // ----------------------------------------------------
    window.toggleAccordion = function(id) {
        const content = document.getElementById(id);
        const icon = document.getElementById('icon-' + id);
        if(content.style.display === 'none') {
            content.style.display = 'block';
            icon.classList.add('rotated');
        } else {
            content.style.display = 'none';
            icon.classList.remove('rotated');
        }
    };

    let tarifasDB = [
        { id: '90', parqueadero: 'SERVIDOR CC EL RECREO', zona: 'CC EL RECREO', tipoVehiculo: 'Car', tarifaMax: '1.00', librePaso: '0', fechaInicio: '2024-10-01', fechaFin: '2034-10-01', estado: true }
    ];

    const tarifaTablePanel = document.getElementById('tarifa-table-panel');
    const tableBodyTarifa = document.getElementById('table-body-tarifa');
    const editFormPanelTarifa = document.getElementById('edit-form-panel-tarifa');
    const btnNuevaTarifa = document.getElementById('btn-nueva-tarifa');
    const btnSearchTarifa = document.getElementById('btn-search-tarifa');
    const searchParqueaderoTarifa = document.getElementById('search-parqueadero-tarifa');
    const searchZonaTarifa = document.getElementById('search-zona-tarifa');
    const formParqueaderoTarifa = document.getElementById('form-parqueadero-tarifa');
    const formZonaTarifa = document.getElementById('form-zona-tarifa');
    
    let editingTarifaId = null;

    window.populateTarifasSelects = function() {
        if(!searchParqueaderoTarifa) return;
        
        const populateSelect = (selectElem, items) => {
            selectElem.innerHTML = '<option value="">- SELECCIONAR -</option>';
            items.forEach(item => {
                const option = document.createElement('option');
                option.value = item;
                option.textContent = item;
                selectElem.appendChild(option);
            });
        };

        const nombresParqueaderos = parqueaderosDB.map(p => p.nombre);
        const nombresZonas = zonasDB.map(z => z.nombre);

        populateSelect(searchParqueaderoTarifa, nombresParqueaderos);
        populateSelect(searchZonaTarifa, nombresZonas);
        populateSelect(formParqueaderoTarifa, nombresParqueaderos);
        populateSelect(formZonaTarifa, nombresZonas);
    };

    window.renderTarifaTable = function(data = tarifasDB) {
        if(!tableBodyTarifa) return;
        tableBodyTarifa.innerHTML = '';
        
        if (data.length === 0) {
            tableBodyTarifa.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No se encontraron tarifas</td></tr>`;
        } else {
            data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="col-action">
                        <button class="btn-icon-action" onclick="editTarifa('${item.id}')" title="Editar">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                    </td>
                    <td class="col-action">
                        <button class="btn-icon-action" onclick="deleteTarifa('${item.id}')" style="color: var(--danger);" title="Eliminar">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </td>
                    <td>${item.id}</td>
                    <td>${item.parqueadero}</td>
                    <td>${item.zona}</td>
                    <td>${item.tipoVehiculo}</td>
                `;
                tableBodyTarifa.appendChild(tr);
            });
        }
    };

    if(btnSearchTarifa) {
        btnSearchTarifa.addEventListener('click', () => {
            const p = searchParqueaderoTarifa.value;
            const z = searchZonaTarifa.value;
            let result = tarifasDB;
            
            if(p) result = result.filter(item => item.parqueadero === p);
            if(z) result = result.filter(item => item.zona === z);
            
            tarifaTablePanel.style.display = 'block';
            editFormPanelTarifa.style.display = 'none';
            renderTarifaTable(result);
        });
    }

    if(btnNuevaTarifa) {
        btnNuevaTarifa.addEventListener('click', () => {
            editingTarifaId = null;
            formParqueaderoTarifa.value = '';
            formZonaTarifa.value = '';
            document.getElementById('form-tipo-tarifa').value = 'Unknow';
            document.getElementById('form-libre-paso').value = '0';
            document.getElementById('form-tarifa-max').value = '';
            document.getElementById('form-fecha-inicio').value = '';
            document.getElementById('form-fecha-fin').value = '';
            document.getElementById('form-estado-tarifa').checked = true;
            
            tarifaTablePanel.style.display = 'none';
            editFormPanelTarifa.style.display = 'block';
            editFormPanelTarifa.scrollIntoView({ behavior: 'smooth' });
        });
    }

    window.editTarifa = function(id) {
        const item = tarifasDB.find(t => t.id === id);
        if(!item) return;
        editingTarifaId = id;
        
        formParqueaderoTarifa.value = item.parqueadero;
        formZonaTarifa.value = item.zona;
        document.getElementById('form-tipo-tarifa').value = item.tipoVehiculo;
        document.getElementById('form-libre-paso').value = item.librePaso;
        document.getElementById('form-tarifa-max').value = item.tarifaMax;
        document.getElementById('form-fecha-inicio').value = item.fechaInicio;
        document.getElementById('form-fecha-fin').value = item.fechaFin;
        document.getElementById('form-estado-tarifa').checked = item.estado;
        
        tarifaTablePanel.style.display = 'none';
        editFormPanelTarifa.style.display = 'block';
        editFormPanelTarifa.scrollIntoView({ behavior: 'smooth' });
    };

    window.deleteTarifa = function(id) {
        if(confirm(`¿Estás seguro de eliminar la tarifa ID ${id}?`)) {
            tarifasDB = tarifasDB.filter(t => t.id !== id);
            btnSearchTarifa.click();
            showNotification('Tarifa eliminada');
        }
    };

    window.closeFormTarifa = function() {
        editFormPanelTarifa.style.display = 'none';
        if(tarifaTablePanel.style.display === 'none') {
            tarifaTablePanel.style.display = 'block';
        }
    };

    window.saveFormTarifa = function() {
        const parqueadero = formParqueaderoTarifa.value;
        const zona = formZonaTarifa.value;
        const tipoVehiculo = document.getElementById('form-tipo-tarifa').value;
        const librePaso = document.getElementById('form-libre-paso').value;
        const tarifaMax = document.getElementById('form-tarifa-max').value;
        const fechaInicio = document.getElementById('form-fecha-inicio').value;
        const fechaFin = document.getElementById('form-fecha-fin').value;
        const estado = document.getElementById('form-estado-tarifa').checked;
        
        if(!parqueadero || !zona) {
            showNotification('Parqueadero y Zona son obligatorios', true);
            return;
        }

        if(editingTarifaId) {
            const index = tarifasDB.findIndex(t => t.id === editingTarifaId);
            if(index !== -1) {
                tarifasDB[index] = { ...tarifasDB[index], parqueadero, zona, tipoVehiculo, librePaso, tarifaMax, fechaInicio, fechaFin, estado };
                showNotification('Tarifa actualizada');
            }
        } else {
            const newId = Math.floor(Math.random() * 1000).toString();
            tarifasDB.unshift({ id: newId, parqueadero, zona, tipoVehiculo, librePaso, tarifaMax, fechaInicio, fechaFin, estado });
            showNotification('Nueva tarifa creada');
        }
        
        closeFormTarifa();
        searchParqueaderoTarifa.value = parqueadero;
        searchZonaTarifa.value = zona;
        btnSearchTarifa.click();
    };

    // ----------------------------------------------------
    // LÓGICA DE RECARGA EN EFECTIVO
    // ----------------------------------------------------
    const btnConsultarRecarga = document.getElementById('btn-consultar-recarga');
    const btnRecargar = document.getElementById('btn-recargar');
    const btnNuevaRecarga = document.getElementById('btn-nueva-recarga');
    const resultadoRecarga = document.getElementById('resultado-recarga');
    
    if(btnConsultarRecarga) {
        btnConsultarRecarga.addEventListener('click', () => {
            const identificacion = document.getElementById('form-id-recarga').value.trim();
            if(!identificacion) {
                showNotification('Ingrese un número de identificación', true);
                return;
            }
            
            // Simular búsqueda
            btnConsultarRecarga.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Consultando...';
            btnConsultarRecarga.disabled = true;
            
            setTimeout(() => {
                // Llenar datos simulados
                document.getElementById('res-nombre').textContent = 'DAYSI';
                document.getElementById('res-tarjeta').textContent = Math.floor(Math.random() * 900000 + 100000);
                document.getElementById('res-saldo').textContent = '14.00';
                document.getElementById('res-activa').textContent = 'SI';
                
                // Reiniciar inputs de recarga
                document.getElementById('form-valor-recargar').value = '';
                document.getElementById('form-comision').value = '';
                document.getElementById('form-total-pagar').value = '';
                
                resultadoRecarga.style.display = 'block';
                btnRecargar.disabled = false;
                btnRecargar.style.opacity = '1';
                
                btnConsultarRecarga.innerHTML = '<i class="fa-solid fa-search"></i> Consultar';
                btnConsultarRecarga.disabled = false;
                showNotification('Cliente encontrado');
            }, 600);
        });
    }
    
    // Cálculo dinámico de comisión y total
    const valorRecargarInput = document.getElementById('form-valor-recargar');
    if(valorRecargarInput) {
        valorRecargarInput.addEventListener('input', (e) => {
            const valor = parseFloat(e.target.value) || 0;
            const comision = valor > 0 ? 0.50 : 0; // Simulando una comisión fija de $0.50
            const total = valor + comision;
            
            document.getElementById('form-comision').value = valor > 0 ? comision.toFixed(2) : '';
            document.getElementById('form-total-pagar').value = valor > 0 ? total.toFixed(2) : '';
        });
    }

    if(btnRecargar) {
        btnRecargar.addEventListener('click', () => {
            const monto = parseFloat(document.getElementById('form-valor-recargar').value);
            if(!monto || monto <= 0) {
                showNotification('Ingrese un monto válido para recargar', true);
                return;
            }
            
            // Simular recarga
            btnRecargar.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Procesando...';
            btnRecargar.disabled = true;
            
            setTimeout(() => {
                const saldoActualElem = document.getElementById('res-saldo');
                const nuevoSaldo = parseFloat(saldoActualElem.textContent) + monto;
                saldoActualElem.textContent = nuevoSaldo.toFixed(2);
                
                showNotification(`¡Recarga procesada con éxito!`);
                
                document.getElementById('form-valor-recargar').value = '';
                document.getElementById('form-comision').value = '';
                document.getElementById('form-total-pagar').value = '';
                
                btnRecargar.innerHTML = 'Recargar';
                btnRecargar.disabled = false;
            }, 800);
        });
    }

    if(btnNuevaRecarga) {
        btnNuevaRecarga.addEventListener('click', () => {
            document.getElementById('form-id-recarga').value = '';
            document.getElementById('form-valor-recargar').value = '';
            document.getElementById('form-comision').value = '';
            document.getElementById('form-total-pagar').value = '';
            
            resultadoRecarga.style.display = 'none';
            btnRecargar.disabled = true;
            btnRecargar.style.opacity = '0.5';
        });
    }

    // ----------------------------------------------------
    // LÓGICA DE CÓDIGOS PROMOCIONALES
    // ----------------------------------------------------
    const btnGenerarCodigos = document.getElementById('btn-generar-codigos');
    const btnLimpiarPromo = document.getElementById('btn-limpiar-promo');
    const promoResultado = document.getElementById('promo-resultado');
    const promoCodeDisplay = document.getElementById('promo-code-display');

    if(btnGenerarCodigos) {
        btnGenerarCodigos.addEventListener('click', () => {
            const nombre = document.getElementById('form-promo-nombre').value.trim();
            const prefijo = document.getElementById('form-promo-prefijo').value.trim().toUpperCase();
            const valor = document.getElementById('form-promo-valor').value;

            if(!nombre || !valor) {
                showNotification('Nombre y Valor son obligatorios', true);
                return;
            }

            // Simular generación
            btnGenerarCodigos.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generando...';
            btnGenerarCodigos.disabled = true;

            setTimeout(() => {
                const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const codeFinal = prefijo ? `${prefijo}-${randomCode}` : randomCode;
                
                promoCodeDisplay.textContent = codeFinal;
                promoResultado.style.display = 'block';
                
                showNotification('Códigos promocionales generados exitosamente');
                
                btnGenerarCodigos.innerHTML = 'Generar códigos';
                btnGenerarCodigos.disabled = false;
            }, 800);
        });
    }

    if(btnLimpiarPromo) {
        btnLimpiarPromo.addEventListener('click', () => {
            document.getElementById('form-promo-nombre').value = '';
            document.getElementById('form-promo-inicio').value = '';
            document.getElementById('form-promo-fin').value = '';
            document.getElementById('form-promo-tipo').value = 'Unico';
            document.getElementById('form-promo-prefijo').value = '';
            document.getElementById('form-promo-valor').value = '';
            
            promoResultado.style.display = 'none';
        });
    }

    // ----------------------------------------------------
    // INICIALIZACIÓN DASHBOARD ADMINISTRATIVO
    // ----------------------------------------------------
    function initAdminDashboard() {
        // 1. Chart.js
        const ctx = document.getElementById('configChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                    datasets: [
                        {
                            label: 'Meypar',
                            data: [1, 2, 2, 3, 5, 6, 8, 9, 10, 11, 12, 14],
                            borderColor: '#ff5a1f',
                            backgroundColor: 'rgba(255, 90, 31, 0.1)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'TGW',
                            data: [0, 0, 1, 1, 2, 4, 4, 5, 5, 7, 8, 10],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            fill: true,
                            tension: 0.4
                        },
                        {
                            label: 'Autopark',
                            data: [0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 3, 3],
                            borderColor: '#0ea5e9',
                            backgroundColor: 'rgba(14, 165, 233, 0.1)',
                            fill: true,
                            tension: 0.4
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { labels: { color: '#e2e8f0' } }
                    },
                    scales: {
                        x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                        y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(255,255,255,0.05)' } }
                    }
                }
            });
        }

        // 2. Leaflet Map
        const mapContainer = document.getElementById('map-container');
        if (mapContainer && typeof L !== 'undefined') {
            const map = L.map('map-container').setView([-1.8312, -78.1834], 6); // Centro Ecuador
            
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; OpenStreetMap &copy; CARTO'
            }).addTo(map);

            // Mock markers
            const sedes = [
                { name: 'CCI Iñaquito', lat: -0.1772, lng: -78.4796, city: 'Quito' },
                { name: 'La República', lat: -0.1944, lng: -78.4842, city: 'Quito' },
                { name: 'Aeropuerto Tababela', lat: -0.1133, lng: -78.3586, city: 'Quito' },
                { name: 'San Marino', lat: -2.1762, lng: -79.8973, city: 'Guayaquil' },
                { name: 'Malecón 2000', lat: -2.1932, lng: -79.8789, city: 'Guayaquil' }
            ];

            const markerIcon = L.divIcon({
                className: 'custom-div-icon',
                html: "<div style='background-color:#ff5a1f; width:12px; height:12px; border-radius:50%; border:2px solid white;'></div>",
                iconSize: [12, 12],
                iconAnchor: [6, 6]
            });

            sedes.forEach(sede => {
                L.marker([sede.lat, sede.lng], { icon: markerIcon })
                 .addTo(map)
                 .bindPopup(`<b>${sede.name}</b><br>${sede.city}`);
            });
            
            // Fix map size bug in hidden div
            setTimeout(() => { map.invalidateSize(); }, 500);
            
            // Re-invalidate on module change
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.target.classList.contains('active')) {
                        map.invalidateSize();
                    }
                });
            });
            const dashboardView = document.getElementById('view-dashboard');
            if(dashboardView) {
                observer.observe(dashboardView, { attributes: true, attributeFilter: ['class'] });
            }
        }

        // 3. User List Mock
        const userListDiv = document.getElementById('mock-user-list');
        if (userListDiv) {
            const users = [
                { name: 'Carlos Mendoza', role: 'Administrador', lastActive: 'Hace 5 min', initial: 'C' },
                { name: 'Andrea Torres', role: 'Operador Quito', lastActive: 'Hace 12 min', initial: 'A' },
                { name: 'Miguel Zambrano', role: 'Operador GYE', lastActive: 'Hace 1 hora', initial: 'M' },
                { name: 'Elena Rojas', role: 'Técnico Soporte', lastActive: 'Ayer', initial: 'E' }
            ];
            
            let html = '';
            users.forEach((u, idx) => {
                const colors = ['var(--accent-primary)', 'var(--success)', 'var(--warning)', 'var(--info)', '#8b5cf6'];
                const bg = colors[idx % colors.length];
                html += `
                    <div class="user-list-item">
                        <div class="avatar" style="background: ${bg}">${u.initial}</div>
                        <div class="user-details">
                            <h5>${u.name}</h5>
                            <p>Última vez: ${u.lastActive}</p>
                        </div>
                        <span class="user-role">${u.role}</span>
                    </div>
                `;
            });
            userListDiv.innerHTML = html;
        }
    }
    
    // Llamar al inicio
    setTimeout(initAdminDashboard, 500);

});
