import { io } from "socket.io-client";

if (!window.__QR_BRIDGE_STARTED__) {
  window.__QR_BRIDGE_STARTED__ = true;

  const SERVER_URL = "https://qr-scan-0es0.onrender.com/";
  const ROOM_ID = "shop-counter-1";
  const APPEND_MODE = false;
  const PRESS_ENTER = true;

  let lastFocusedElement = null;

  function isTextLikeInput(el) {
    if (!el) return false;

    const tag = (el.tagName || "").toLowerCase();
    const type = (el.type || "").toLowerCase();

    if (el.disabled || el.readOnly) return false;

    if (tag === "textarea") return true;

    if (tag === "input") {
      return ![
        "checkbox",
        "radio",
        "file",
        "submit",
        "reset",
        "button",
        "image",
        "range",
        "color",
        "date",
        "datetime-local",
        "month",
        "time",
        "week"
      ].includes(type);
    }

    return !!el.isContentEditable;
  }

  function getSetter(el) {
    if (!el) return null;

    if (el.tagName.toLowerCase() === "textarea") {
      return Object.getOwnPropertyDescriptor(
        window.HTMLTextAreaElement.prototype,
        "value"
      )?.set;
    }

    if (el.tagName.toLowerCase() === "input") {
      return Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )?.set;
    }

    return null;
  }

  function triggerAllEvents(el) {
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
    el.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));

    if (PRESS_ENTER) {
      el.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "Enter",
          code: "Enter",
          which: 13,
          keyCode: 13,
          bubbles: true
        })
      );

      el.dispatchEvent(
        new KeyboardEvent("keyup", {
          key: "Enter",
          code: "Enter",
          which: 13,
          keyCode: 13,
          bubbles: true
        })
      );
    }
  }

  function insertValueIntoField(text) {
    const target =
      isTextLikeInput(document.activeElement)
        ? document.activeElement
        : isTextLikeInput(lastFocusedElement)
        ? lastFocusedElement
        : null;

    if (!target) {
      console.log("QR bridge: no valid focused input found");
      return;
    }

    target.focus();

    if (target.isContentEditable) {
      const oldValue = target.textContent || "";
      target.textContent = APPEND_MODE ? oldValue + text : text;
      triggerAllEvents(target);
      return;
    }

    const oldValue = target.value || "";
    const newValue = APPEND_MODE ? oldValue + text : text;

    const setter = getSetter(target);

    if (setter) {
      setter.call(target, newValue);
    } else {
      target.value = newValue;
    }

    triggerAllEvents(target);
  }

  document.addEventListener(
    "focusin",
    (event) => {
      const el = event.target;
      if (isTextLikeInput(el)) {
        lastFocusedElement = el;
      }
    },
    true
  );

  const socket = io(SERVER_URL, {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000
  });

  socket.on("connect", () => {
    console.log("QR bridge connected:", socket.id);
    socket.emit("join-room", ROOM_ID);
  });

  socket.on("joined-room", (room) => {
    console.log("QR bridge joined room:", room);
  });

  socket.on("receive-scanned-data", ({ text }) => {
    console.log("Received scan:", text);
    insertValueIntoField(text);
  });

  socket.on("connect_error", (err) => {
    console.log("Socket connection error:", err.message);
  });
}