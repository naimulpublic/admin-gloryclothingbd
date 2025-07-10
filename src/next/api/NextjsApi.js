export async function GetSubCategoriesApi() {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/subcategories`
  );
  const response = await request.json();
  return response;
}

export async function GetCategoriesApi() {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/categories`
  );
  const response = await request.json();
  return response;
}

export async function GetSlidersApi() {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/sliders`
  );
  const response = await request.json();
  return response;
}

export async function GetCuponsApi() {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/coupons`
  );
  const response = await request.json();
  return response;
}

export async function GetRootAdminApi() {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/admins`
  );
  const response = await request.json();
  return response;
}

export async function GetBrandsApi() {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/brands`
  );
  const response = await request.json();
  return response;
}

export async function GetProductsApi() {
  const request = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/get/products`
  );
  const response = await request.json();
  return response;
}
