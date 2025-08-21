<script>
/* --- Load Properties from IndexedDB --- */
const propertyDB = {
    db: null,
    init: function () {
        return new Promise((resolve, reject) => {
            if (this.db) return resolve();
            const request = indexedDB.open("mohsinEstateDB", 1);
            request.onupgradeneeded = function (e) {
                const db = e.target.result;
                if (!db.objectStoreNames.contains("properties")) {
                    db.createObjectStore("properties", { keyPath: "id", autoIncrement: true });
                }
            };
            request.onsuccess = function (e) {
                propertyDB.db = e.target.result;
                resolve();
            };
            request.onerror = function (e) {
                reject("Error opening DB");
            };
        });
    }
};

function loadProperties() {
    propertyDB.init().then(() => {
        const tx = propertyDB.db.transaction("properties", "readonly");
        const store = tx.objectStore("properties");
        const request = store.getAll();
        request.onsuccess = function (e) {
            const properties = e.target.result;
            renderProperties(properties);
        };
    });
}

function renderProperties(properties) {
    const container = document.getElementById("property-listings");
    container.innerHTML = "";
    properties.forEach(p => {
        container.innerHTML += `
        <div class="col-md-4">
            <div class="property-card">
                <div class="property-image">
                    <img src="${p.image || 'https://via.placeholder.com/400x300'}" class="img-fluid" alt="Property">
                    <span class="property-badge">${p.type}</span>
                </div>
                <div class="property-content">
                    <h5>${p.title}</h5>
                    <p>${p.description}</p>
                    <div class="property-price">PKR ${p.price}</div>
                </div>
            </div>
        </div>`;
    });
}

document.addEventListener("DOMContentLoaded", loadProperties);
</script>
