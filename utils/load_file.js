
function load_file(url, callback) {
    const client = new XMLHttpRequest();
    client.open('GET', url);
    client.onload = function () {
        callback(client.responseText.trim());
    };
    client.send();
}