import { supabase } from "./inc/database.js";

const addNameButton = document.getElementById("addName");
const nameList = document.getElementById("namesList");
let namesChannel;

async function updateNamesList() {

    let { data, error } = await supabase
        .from('names')
        .select('*')

    if (error) {
        console.error("Error fetching names:", error);
        return;
    }

    nameList.innerHTML = data.map(item =>
        `<li>${item.name} <input type="button" onclick="deleteName(${item.id})" value="Borrar"></li>`
    ).join('');
}

window.deleteName = async function(id) {
    const { data, error } = await supabase
  .from('names')
  .delete()
  .eq('id', id)
  
  if (error) {
        console.error("Error borrando:", error);
        return;
    }
}

const setupRealtime = () => {
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

document.addEventListener("DOMContentLoaded", async () => {
    try {
        await updateNamesList();
        setupRealtime();
    } catch (err) {
        console.error("Error inicial:", err);
    }
});

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

window.addEventListener('beforeunload', () => {
    if (namesChannel) supabase.removeChannel(namesChannel);
});