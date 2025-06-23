import { supabase } from "./inc/database.js";


const names = [];
const addNameButton = document.getElementById("addName");
const nameList = document.getElementById("nameList");

addNameButton.addEventListener("click", async () => {
    const name = document.getElementById("name");
    names.push(name.value);
    name.value = "";
    const { data, error } = await supabase
        .from('names')
        .insert([{ name: names[names.length - 1] }]);
    if (error) {
        console.error("Error inserting name:", error);
    }
    if (!data || data.length === 0) return;

    console.log("Inserted name:", data);

    data.forEach(e => async () => {
        // Primero limpiamos la lista
        nameList.innerHTML = "";

        // Luego obtenemos TODOS los nombres de la base de datos
        const { data: allNames, error: fetchError } = await supabase
            .from('names')
            .select('*');

        if (!fetchError) {
            allNames.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item.name;
                nameList.appendChild(li);
            });
        }
    });
});
