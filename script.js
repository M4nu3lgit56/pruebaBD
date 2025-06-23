import "./inc/database.js";


const names = [];
const name = document.getElementById("name");
const addNameButton = document.getElementById("addName");
const nameList = document.getElementById("nameList");

addNameButton.addEventListener("click", async () => {
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

