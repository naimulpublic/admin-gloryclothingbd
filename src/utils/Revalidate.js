export async function revalidateProducts() {
  await fetch(`${process.env.FRONTEND_ORIGIN}/api/revalidate-products`, {
    method: "POST",
  });
}
export async function revalidateCategores() {
  await fetch(`${process.env.FRONTEND_ORIGIN}/api/revalidate-categorys`, {
    method: "POST",
  });
}

export async function revalidateSliders() {
  await fetch(`${process.env.FRONTEND_ORIGIN}/api/revalidate-Sliders`, {
    method: "POST",
  });
}
