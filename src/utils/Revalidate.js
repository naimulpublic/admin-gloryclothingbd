export async function revalidateProducts() {
  await fetch(`https://www.gloryclothingbd.com/api/revalidate-products`, {
    method: "POST",
  });
}
export async function revalidateCategores() {
  await fetch(`https://www.gloryclothingbd.com/api/revalidate-categorys`, {
    method: "POST",
  });
}

export async function revalidateSliders() {
  await fetch(`https://www.gloryclothingbd.com/api/revalidate-Sliders`, {
    method: "POST",
  });
}
