function get_cookie(key) {
    const cookies = document.cookie;
    const cookies_string = cookies.split(";");
    let cookies_dict = {};
    cookies_string.forEach((cookies_string) => {
        const cookie_pair = cookies_string.split("=");
        const key_index = 0;
        const value_index = 1;

        const cookie_key = cookie_pair[key_index];
        const first_bracket_index = 1;
        const last_bracket_index = cookie_pair[value_index].length - 1;
        const cookie_value = cookie_pair[value_index];

        cookies_dict[cookie_key] = cookie_value;
    });
    return cookies_dict[key];
}

async function get_dirs(work_directory) {
    const url = "/dir"

    const request_body = {
        "cwd": work_directory
    }

    const request_options = {
        method: "POST",
        mode: "cors",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(request_body)
    }
    const response = await fetch(url, request_options);
    const json = await response.json();
    return json;
}

function get_icon_path(type) {
    const path_to_resources = "/static/resources/images/";
    const path_to_folder_icon = path_to_resources + "/" + "folder_icon.png";
    const path_to_file_icon = path_to_resources + "/" + "file_icon.png";
    const path_to_filelink_icon = path_to_resources + "/" + "filelink_icon.png";

    switch (type) {
        case "directory":
            return path_to_folder_icon;
        case "file":
            return path_to_file_icon;
        case "link":
            return path_to_filelink_icon;
        default:
            return "";
    }
}

function create_directory_item_node(item_text, item_type) {
    const node = document.createElement("li");

    const image_item = document.createElement("img");
    image_item.src = get_icon_path(item_type);
    image_item.className = "item_icon";

    const text_item = document.createElement("span");
    text_item.className = "no_select";
    text_item.innerText = item_text;

    node.appendChild(image_item);
    node.appendChild(text_item);
    node.className = "directory_item";
    node.addEventListener("click", (event) => {
        const next_dir = event.target.innerText;
        get_dirs(next_dir)
            .then((dirs) => {
                update_view(dirs);
            })
    })
    return node;
}

function update_view(dirs) {
    const items_view = document.getElementsByClassName("directory_items")[0];
    items_view.innerHTML = "";
    const items = dirs["directory_info"];

    items.forEach((directory_item) => {
        const item_text = directory_item["item_name"];
        const item_type = directory_item["meta"]["type"];
        const item = create_directory_item_node(item_text, item_type);
        items_view.appendChild(item);
    });
}

const current_dir = get_cookie("dir");
get_dirs(current_dir).then((dirs) => {
    update_view(dirs);
});