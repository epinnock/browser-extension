import { TAXY_ELEMENT_SELECTOR } from '../../constants';

function isInteractive(
  element: HTMLElement,
  style: CSSStyleDeclaration
): boolean {
  return (
    element.tagName === 'A' ||
    element.tagName === 'INPUT' ||
    element.tagName === 'BUTTON' ||
    element.tagName === 'SELECT' ||
    element.tagName === 'TEXTAREA' ||
    element.hasAttribute('onclick') ||
    element.hasAttribute('onmousedown') ||
    element.hasAttribute('onmouseup') ||
    element.hasAttribute('onkeydown') ||
    element.hasAttribute('onkeyup') ||
    style.cursor === 'pointer'
  );
}

function isVisible(element: HTMLElement, style: CSSStyleDeclaration): boolean {
  return (
    style.opacity !== '' &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    element.getAttribute('aria-hidden') !== 'true'
  );
}

let currentElements: HTMLElement[] = [];

function traverseDOM(node: Node, pageElements: HTMLElement[]) {
  const clonedNode = node.cloneNode(false) as Node;

  if (node.nodeType === Node.ELEMENT_NODE) {
    const element = node as HTMLElement;
    const style = window.getComputedStyle(element);

    const clonedElement = clonedNode as HTMLElement;

    pageElements.push(element);
    clonedElement.setAttribute('data-id', (pageElements.length - 1).toString());
    clonedElement.setAttribute(
      'data-interactive',
      isInteractive(element, style).toString()
    );
    clonedElement.setAttribute(
      'data-visible',
      isVisible(element, style).toString()
    );
  }

  node.childNodes.forEach((child) => {
    const result = traverseDOM(child, pageElements);
    clonedNode.appendChild(result.clonedDOM);
  });

  return {
    pageElements,
    clonedDOM: clonedNode,
  };
}

/**
 * getAnnotatedDom returns the pageElements array and a cloned DOM
 * with data-pe-idx attributes added to each element in the copy.
 */
export default function getAnnotatedDOM() {
  currentElements = [];
  const result = traverseDOM(document.documentElement, currentElements);
  return (result.clonedDOM as HTMLElement).outerHTML;
}


export async function captureTab(): Promise<string> {
  const canvas: HTMLCanvasElement = await html2canvas(document.body, {
    useCORS : true,
    allowTaint : true,
 });
  const imageData: string = canvas.toDataURL('image/png');
  return imageData;
}
export async function captureVisibleTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const tab = tabs[0];
      if (!tab) {
        return reject(new Error("No active tab found"));
      }

      chrome.tabs.captureVisibleTab(tab.windowId, {format: "png"}, (dataUrl) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        console.log('captured visible tab')
        console.log(dataUrl)

        resolve(dataUrl);
      });
    });
  });
}

// idempotent function to get a unique id for an element
export function getUniqueElementSelectorId(id: number): string {
  const element = currentElements[id];
  // element may already have a unique id
  let uniqueId = element.getAttribute(TAXY_ELEMENT_SELECTOR);
  if (uniqueId) return uniqueId;
  uniqueId = Math.random().toString(36).substring(2, 10);
  element.setAttribute(TAXY_ELEMENT_SELECTOR, uniqueId);
  return uniqueId;
}


