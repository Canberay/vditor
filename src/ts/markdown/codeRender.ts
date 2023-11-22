import {code160to32} from "../util/code160to32";

export const codeRender = (element: HTMLElement) => {
    Array.from<HTMLElement>(element.querySelectorAll("pre > code")).filter((e, index) => {
        if (e.parentElement.classList.contains("vditor-wysiwyg__pre") ||
            e.parentElement.classList.contains("vditor-ir__marker--pre")) {
            return false;
        }
        if (e.classList.contains("language-mermaid") || e.classList.contains("language-flowchart") ||
            e.classList.contains("language-echarts") || e.classList.contains("language-mindmap") ||
            e.classList.contains("language-plantuml") ||
            e.classList.contains("language-abc") || e.classList.contains("language-graphviz") ||
            e.classList.contains("language-math")) {
            return false;
        }

        if (e.style.maxHeight.indexOf("px") > -1) {
            return false;
        }

        // 避免预览区在渲染后由于代码块过多产生性能问题 https://github.com/b3log/vditor/issues/67
        if (element.classList.contains("vditor-preview") && index > 5) {
            return false;
        }

        return true;
      })
      .map((e) => ({ e, codeText: e.innerText }))
      .forEach(({ e, codeText }) => {
        if (e.classList.contains("highlight-chroma")) {
            const codeElement = e.cloneNode(true) as HTMLElement;
            codeElement.innerHTML = e.innerHTML;
            codeElement.querySelectorAll(".highlight-ln").forEach((item: HTMLElement) => {
                item.remove();
            });
            codeText = codeElement.innerText;
        }

        const divElement = document.createElement("div");
        divElement.className = "vditor-copy";
        divElement.innerHTML = `<span aria-label="${window.VditorI18n.copy}"
onmouseover="this.setAttribute('aria-label', '${window.VditorI18n.copy}')"
class="vditor-tooltipped vditor-tooltipped__w"
onclick="this.previousElementSibling.select();document.execCommand('copy');` +
            `this.setAttribute('aria-label', '${window.VditorI18n.copied}')"><svg><use xlink:href="#vditor-icon-copy"></use></svg></span>`;
        const textarea = document.createElement("textarea");
        textarea.value = code160to32(codeText);
        divElement.insertAdjacentElement("afterbegin", textarea);

        e.before(divElement);
        e.style.maxHeight = (window.outerHeight - 40) + "px";
    });
};
