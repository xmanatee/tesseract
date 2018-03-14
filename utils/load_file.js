
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