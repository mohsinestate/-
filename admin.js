<script>
/* --- Save Property in IndexedDB --- */
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

// Example: Save property from a form
function addProperty(property) {
    propertyDB.init().then(() => {
        const tx = propertyDB.db.transaction("properties", "readwrite");
        const store = tx.objectStore("properties");
        store.add(property);
        alert("Property saved successfully!");
    });
}

// Example call (replace with real form values)
document.addEventListener("DOMContentLoaded", () => {
    // If you already have a form, attach this to form submit instead
    // Demo example:
    // addProperty({ title: "120 Sq. Yd House", type: "For Sale", price: "12,000,000", image: "house.jpg", description: "Beautiful new house in Sector 31-B" });
});
</script>
