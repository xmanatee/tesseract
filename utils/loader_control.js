let currently_loading = 0;

function loader_inc() {
    currently_loading += 1;
    document.getElementById("status_cnt").innerText = currently_loading;
    if (currently_loading === 1) {
        document.getElementById("status").style.display = "block";
    }
}

function loader_dec() {
    currently_loading -= 1;
    document.getElementById("status_cnt").innerText = currently_loading;
    if (currently_loading === 0) {
        document.getElementById("status").style.display = "none";
    }
}

function load_file(url, callback) {
    const client = new XMLHttpRequest();
    client.open('GET', url);
    loader_inc();
    client.onload = function () {
        loader_dec();
        callback(client.responseText.trim());
    };
    client.send();
}
