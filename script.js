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

    data.forEach(e => {
        const li = document.createElement("li");
        li.textContent = e.name;
        nameList.appendChild(li);
    });
});

