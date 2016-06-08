function socketConnect(socket) {
    socket.on('subscribe', function (data) {
        console.log(data);
        this.db.collection("events").updateOne({status: data.status}, {$addToSet: {sockets: this.id}}, function (err, result) {
            if (err) return console.error("Unexpected error", err); // TODO: send out email
            console.log("added event", data.status, result.modifiedCount);
        });
    });
    socket.on('publish', function (data) {
        var sockets = this.server.sockets.sockets;
        console.log(data);
        this.db.collection("events").find({status: data.status}, function (err, docs) {     // TODO: add projection for sockets
            if (err) return console.error("Unexpected error", err);
            console.log("found subscribed events", docs.length);
            docs.forEach(function (doc) {
                doc.sockets.forEach(function (sid) {
                    sockets.forEach(function (s) {
                        if (s.id === sid) {
                            console.log("found listener", s);
                            s.emit("update", {message: data.status});
                        }
                    })
                });
            });
        });
    });
    socket.on('disconnect', function () {
        console.log("disconnect");
        var id = this.id;
        this.db.collection("events").updateMany({}, {$pull: {sockets: this.id}}, function (err, result) {
            if (err) return console.error("Cannot remove socket", id);
            console.log("Removed socket:", id);
        });
    });
}

module.exports.eventCallback = socketConnect;