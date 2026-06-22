# Nitro integration

The public Nitro page lives in:

```txt
Sterenna-studio/gwen-ha-star-static/minitel/
```

It should be deployed to:

```txt
https://nitro.sterenna.fr/minitel/
```

## Separation of concerns

```txt
/minitel/
  Static public project page for modern browsers.

/minitel/status
  Optional HTTP status endpoint proxied to Zyra.

/minitel/ws
  Optional WebSocket endpoint proxied to Zyra.

:3615
  Optional Telnet endpoint for ESP32 Telnet Pro.
```

## Recommended public wording

Use this wording to avoid confusion:

> The project page is available at `nitro.sterenna.fr/minitel/`.
> The real Minitel connects to the 3615 Gateways runtime through Telnet or WebSocket.

## Static page content

The `/minitel/` static page should include:

- project pitch;
- architecture diagram;
- current gateway status;
- ESP32/Telnet Pro setup summary;
- links to the GitHub project;
- warning that the Minitel runtime is experimental.

## Reverse proxy sketch

Example with Nginx for WebSocket:

```nginx
location /minitel/ws {
    proxy_pass http://127.0.0.1:8080/minitel/ws;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}

location /minitel/status {
    proxy_pass http://127.0.0.1:8080/minitel/status;
}
```

Telnet on port 3615 is not HTTP and needs a TCP proxy, direct port forwarding, or a tunnel that supports TCP.

For the first public test, WebSocket is simpler than public Telnet.
