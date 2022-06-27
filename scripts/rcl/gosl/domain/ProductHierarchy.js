//-----------------------------------------------------------------------------
/**
 * I represent a single Product in the GOSL Product Hierarchy
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function Product (anId, aName)
{
   this.id = anId;
   this.name = aName;
}


//-----------------------------------------------------------------------------
/**
 * I represent a single ProductType in the GOSL Product Hierarchy
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProductType (anId, aName)
{
   this.id = anId;
   this.name = aName;
   this.products = new Object();
}

ProductType.prototype.addProduct = function (aProduct)
{
   this.products[aProduct.id] = aProduct;
};


//-----------------------------------------------------------------------------
/**
 * I represent a single ProductLine in the GOSL Product Hierarchy
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function ProductLine (anId, aName)
{
   this.id = anId;
   this.name = aName;
   this.productTypes = new Object();
}

ProductLine.prototype.addProductType = function (aProductType)
{
   this.productTypes[aProductType.id] = aProductType;
};


//-----------------------------------------------------------------------------
/**
 * I represent the entire Product Hierarchy in the GOSL model
 *
 * @constructor
 * @author - Lance Hankins (lhankins@focus-technologies.com)
 **/
function Catalog ()
{
   this.productLines = new Object();
}

Catalog.prototype.addProductLine = function (aProductLine)
{
   this.productLines[aProductLine.id] = aProductLine;
};
