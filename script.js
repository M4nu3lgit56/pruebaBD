import { supabase } from "./inc/database.js";

const addNameButton = document.getElementById("addName");
const nameList = document.getElementById("nameList");
let namesChannel;

async function updateNamesList() {
    const { data, error } = await supabase
        .from('names')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching names:", error);
        return;
    }

    nameList.innerHTML = data.map(item => 
        `<li>${item.name}</li>`
    ).join('');
}

const setupRealtime = () => {
    // Evita múltiples suscripciones
    if (namesChannel) return;

    namesChannel = supabase.channel('names-updates')
        .on('postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'names'
        }, () => updateNamesList())
        .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
                console.log('Canal suscrito correctamente');
            }
            if (err) {
                console.error('Error en suscripción:', err);
            }
        });
};

// Inicialización
document.addEventListener("DOMContentLoaded", async () => {
    try {
        await updateNamesList();
        setupRealtime();
    } catch (err) {
        console.error("Error inicial:", err);
    }
});

// Insertar nombre
addNameButton.addEventListener("click", async () => {
    const nameInput = document.getElementById("name");
    const name = nameInput.value.trim();

    if (!name) return;

    const { error } = await supabase
        .from('names')
        .insert([{ name }]);

    if (error) {
        console.error("Error insertando:", error);
        return;
    }

    nameInput.value = "";
});

// Limpieza
window.addEventListener('beforeunload', () => {
    if (namesChannel) supabase.removeChannel(namesChannel);
});