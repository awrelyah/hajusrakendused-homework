export default function useBackend() {
  const accessToken = "fh-23k1Yxho7yVDQb3_CQODspoevhQFE";
  const backendUrl = "http://demo2.z-bit.ee";

  const sendReq = (url, method, body) => {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${accessToken}`);
    myHeaders.append("Accept", "application/json");

    var requestOptions = {
      method: method,
      headers: myHeaders,
      redirect: "follow",
    };
    const noBodyMethods = ["GET", "DELETE", "HEAD", "OPTIONS"];

    //add body only for those methods that allow it
    if (!noBodyMethods.includes(method.toUpperCase())) {
      requestOptions.body = body;
    }

    return fetch(`${backendUrl}/${url}`, requestOptions)
      .then((response) => response.json())
      .catch((error) => console.log("error", error));
  };

  return {
    sendReq,
  };
}
