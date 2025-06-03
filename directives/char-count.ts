import type { DirectiveBinding } from "vue";

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<number>) {
    const maxChars = binding.value;

    if (typeof maxChars !== "number") return;

    const parent = el.parentElement;
    if (!parent) return;

    const prevPos = getComputedStyle(parent).position;
    if (prevPos === "static" || !prevPos) {
      parent.style.position = "relative";
    }

    const counter = document.createElement("div");
    counter.style.position = "absolute";
    counter.style.bottom = "100%";
    counter.style.marginBottom = "0.5rem";
    counter.style.right = "0";
    counter.style.fontSize = "0.75rem";
    counter.style.color = "#98A2B3";
    counter.style.pointerEvents = "none";
    counter.style.display = "none";

    if (parent) {
      parent.appendChild(counter);
    }

    const updateCounter = () => {
      const value = (el as HTMLInputElement).value;
      const length = value.length;

      if (length > 0) {
        counter.textContent = `${length} из ${maxChars} символов`;
        counter.style.display = "block";

        if (length > maxChars) {
          counter.style.color = "#B42318";
          el.style.borderColor = "#B42318";
        } else {
          counter.style.color = "#98A2B3";
          el.style.borderColor = "";
        }
      } else {
        counter.style.display = "none";
      }
    };

    el.addEventListener("input", updateCounter);
    (el as any)._charCountHandler = updateCounter;

    updateCounter();
  },

  unmounted(el: HTMLElement) {
    const handler = (el as any)._charCountHandler;
    if (handler) {
      el.removeEventListener("input", handler);
    }
  },
};
