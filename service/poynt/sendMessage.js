const deviceMessage = async (options, StoreData) => {
    console.log("send message in Service Page")
    let poynt = require("poynt")({
        applicationId: options.applicationId,
        key: options.applicationIdkey,
    });
    try {
       return await poynt.sendCloudMessage(
            {
                businessId: options.businessId,
                storeId: StoreData.storeId,
                deviceId: StoreData.storeDeviceId,
                ttl: 500,
                recipientClassName: "co.poynt.terminal",
                recipientPackageName: "com.example.poyntdemo",
                message: "Success",
            },
            function (err, doc) {
                if (err) {
                    console.log(err)
                    return(err);
                }
                console.log(JSON.stringify(doc))
                return(JSON.stringify(doc));
            }
        );
    } catch (e) {
        console.log(e);
    }
};

module.exports = {
    deviceMessage: deviceMessage,
};
