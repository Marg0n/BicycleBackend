import QueryBuilder from '../../builder/QueryBuilder';
import { productSearchableFields } from './product.constant';
import { TProduct } from './product.interface';
import { Product } from './product.model';

const createABicycleIntoDB = async (productData: TProduct) => {
  const productExists = await Product.findOne({ _id: productData._id });
  if (productExists) {
    throw new Error('Product with this ID already exists!');
  }

  const result = await Product.create(productData);
  return result;
};

const updateABicycleFromDB = async (
  id: string,
  updatedProductData: Partial<{
    price: number;
    quantity: number;
    inStock: boolean;
    name: string;
    brand: string;
    description: string;
    type: "Mountain" | "Road" | "Hybrid" | "BMX" | "Electric" | "Fat Bikes";
    Img: string;
    rating: number;
  }>,
) => {
  const product = await Product.findById(id);
  if (!product) {
    throw new Error('Product not found');
  }

  if (updatedProductData.price) {
    product.price = updatedProductData.price;
  }

  if (updatedProductData.quantity) {
    product.quantity = updatedProductData.quantity;
  }

  if (updatedProductData.inStock !== undefined) {
    product.inStock = updatedProductData.inStock;
  }

  if (updatedProductData.name) {
    product.name = updatedProductData.name;
  }

  if (updatedProductData.brand) {
    product.brand = updatedProductData.brand;
  }

  if (updatedProductData.description) {
    product.description = updatedProductData.description;
  }

  if (updatedProductData.type) {
    product.type = updatedProductData.type;
  }

  if (updatedProductData.Img) {
    product.Img = updatedProductData.Img;
  }

  if (updatedProductData.rating) {
    product.rating = updatedProductData.rating;
  }

  await product.save();

  return product;
};

const getAllBicyclesFromDB = async (query: Record<string, unknown>) => {
  // Filter out deleted products
  const filter: Record<string, unknown> = {
    isDeleted: { $ne: true },
  };

  const productQuery = new QueryBuilder(Product.find(filter), query)
    .search(productSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await productQuery.countTotal();
  const result = await productQuery.modelQuery;
  return { meta, result };
};

const getASpecificBicycleFromDB = async (id: string) => {
  const result = await Product.findById(id);
  if (!result) {
    throw new Error('Product not found!');
  }
  return result;
};

const deleteABicycleFromDB = async (id: string) => {
  // const result = await Product.findByIdAndDelete(id);
  const result = await Product.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  // return result;

  if (!result) {
    throw new Error('Product not found!');
  }
  return result;
};

const updateProductInventory = async (productId: string, quantity: number) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  //* Allow quantity = 0 only if inStock is false
  if (quantity < 0 || (quantity === 0 && product.inStock !== false)) {
    throw new Error(
      'Quantity must be greater than zero unless marking out of stock',
    );
  }

  if (product.quantity < quantity) {
    throw new Error('Insufficient stock available');
  }

  product.quantity -= quantity;

  // Automatically update stock status
  product.inStock = product.quantity > 0;

  await product.save();

  return product;
};

export const ProductServices = {
  createABicycleIntoDB,
  updateABicycleFromDB,
  getAllBicyclesFromDB,
  getASpecificBicycleFromDB,
  deleteABicycleFromDB,
  updateProductInventory,
};
