import { supabase } from "./inc/database.js";

const addNameButton = document.getElementById("addName");
const nameList = document.getElementById("nameList");
let namesChannel;

// Función optimizada para mostrar nombres
async function UpdatesNames() {
    const { data, error } = await supabase
        .from('names')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching names:", error);
        return;
    }

    const fragment = document.createDocumentFragment();
    data.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item.name;
        fragment.appendChild(li);
    });
    
    nameList.innerHTML = "";
    nameList.appendChild(fragment);
}

// Configuración Realtime mejorada
const setupRealtime = () => {
    if (namesChannel) return;
    
    namesChannel = supabase
        .channel('names-updates')
        .on('postgres_changes', { 
            event: '*',
            schema: 'public', 
            table: 'names' 
        }, (payload) => {
            console.log(`Change (${payload.event}):`, payload.new || payload.old);
            UpdatesNames();
        })
        .subscribe((status, err) => {
            if (err) console.error("Subscription error:", err);
            console.log("Channel status:", status);
        });
};

// Inicialización
window.addEventListener("DOMContentLoaded", async () => {
    await UpdatesNames();
    setupRealtime();
});

// Limpieza
window.addEventListener("beforeunload", () => {
    if (namesChannel) supabase.removeChannel(namesChannel);
});

// Inserción con validación
addNameButton.addEventListener("click", async () => {
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();
    
    if (!name) {
        alert("Por favor ingresa un nombre");
        return;
    }

    const { error } = await supabase
        .from('names')
        .insert([{ name }]);

    if (error) {
        console.error("Error inserting name:", error);
        alert("Error al guardar el nombre");
        return;
    }
    
    nameInput.value = "";
});