import React, { useState, useEffect } from 'react'
import { ShoppingCartOutlined } from '@ant-design/icons';
import { GlobalCart } from '../../App';
import { Badge, Drawer, Input, message } from 'antd';
import axios from 'axios';
import { create } from 'zustand';
import { Link, useNavigate } from 'react-router-dom';

const useFormObject = create((set, get) => ({
  formObject: {},
  setFormObject: (keyValue) => set((state) => ({ formObject: { ...state.formObject, ...keyValue } })),
  setFormObjectArray: (array_key, array_index, field_key, value) => set((state) => {
    if (typeof field_key === 'object') {
      const newFormObject = { ...state.formObject };
      newFormObject[array_key][array_index] = { ...newFormObject[array_key][array_index], ...field_key };
      return { formObject: newFormObject };
    } else {
      const newFormObject = { ...state.formObject };
      // newFormObject[array_key][array_index][field_key] = value;
      const newArray = newFormObject[array_key];
      newArray[array_index][field_key] = value;
      newFormObject[array_key] = newArray;
      return { formObject: newFormObject };
    }
  }),
  getFormObjectArrayValue: (array_key, array_index, field_key) => get().formObject[array_key][array_index][field_key],
  getFormObject: () => get().formObject,
}))

const BottomCartBar = ({ }) => {
  const cart = GlobalCart((state) => state.cart);
  const totalPrice = cart.reduce((total, product) => total + product.price * product.quantity, 0)
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')

  const [selectedAdd, setSelectedAdd] = useState(0)
  const [address, setAddress] = useState('')
  const [apartment, setApartment] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [pincode, setPincode] = useState('')
  const [paymentType, setPaymentType] = useState('COD')
  const [loading, setLoading] = useState(false)
  const [messageApi, contextHolder] = message.useMessage()
  const [response, setResponse] = useState(null)
  const [products, setProducts] = useState([]);
  const [profileData, setProfileData] = useState({})

  const formObject = useFormObject((state) => state.formObject);
  const getFormObject = useFormObject((state) => state.getFormObject);
  const setArrValue = useFormObject((state) => state.setFormObjectArray);
  const setFormObject = useFormObject((state) => state.setFormObject);
  const moduleName = 'Invoices';
  const tableId = GlobalCart((state) => state.tableId);
  const orgId = GlobalCart((state) => state.orgId);
  const setCart = GlobalCart((state) => state.setCart);
  const orderId = GlobalCart((state) => state.orderId);
  const params = {}
  console.log('orderId', orderId);
  const navigate = useNavigate();

  const getModuleCreateData = async (values = null) => {
    const responseOrg = await axios.post(`https://accounting-new.inkapps.io/api/${moduleName}/getCreateData`, {
      ...params
    }, {
      headers: {
        'Content-Type': 'application/json',
        'hosturl': 'jamee.inkapps.io',
        'orgid': orgId
      },
    });

    const response = responseOrg.data;

    setProducts(response?.Items || []);

    const newObject = {
      "date": new Date(),
      "due_date": new Date(),
      "number": "Auto-Generated",
      "status": "Pending",
      "line_items": [],
      "summary": 0,
      "sub_total": 0,
      "total": 0,
      "total_before_tcs": 0,
      "shipping_charge": 0,
      "adjustment": 0,
      "billing_country": "India",
      "billing_state": "Madhya Pradesh",
      "shipping_country": "India",
      "shipping_state": "Madhya Pradesh",
      "tax_map": {}
    };

    setFormObject(newObject);

    setResponse(response);
  };

  async function getUser() {
    const res = await axios.post(`https://accounting-new.inkapps.io/api/shop/creatCustomerIfNotExists`, {
      ...{
        phone: '+91' + phone,
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'hosturl': 'jamee.inkapps.io',
        'orgid': orgId
      },
    });

    return res.data.data;
  }

  const placeOrder = async () => {
    if (!orderId) {
      if (!name) {
        messageApi.error("Please enter your name!")
        return
      }

      if (!phone) {
        messageApi.error("Please enter your phone number!")
        return
      }
    }

    await getUser();

    const body = {
      customer: {
        name: name,
        email: email,
        phone: '+91' + phone,
      },
      shipping_address: {
        address: '',
        apartment: '',
        city: '',
        state: '',
        pincode: '',
      },
      items: cart.map((product) => ({
        product: product._id,
        quantity: product.quantity,
      })),
      payment_details: {

      },
      invoice_details: getFormObject(),
    };

    body.invoice_details.table_id = tableId;
    body.invoice_details.invoice_id = orderId;
    body.invoice_details.status = "Pending";

    console.log('body', body);

    updateFormObject();

    axios.post("https://accounting-new.inkapps.io/api/shop/placeOrder", body, {
      headers: {
        'Content-Type': 'application/json',
        'hosturl': 'jamee.inkapps.io',
        'orgid': orgId
      },
    }).then((res) => {
      console.log('res', res);
      messageApi.success("Order placed successfully!")
      // window.location.href = '/thank-you';
      // setCart([])
      navigate('/thank-you')
    }).catch((err) => {
      console.log('err', err);
      messageApi.error("Failed to place order!")
    })
  }

  useEffect(() => {
    getModuleCreateData({ disable_auto_line_item: true });
  }, []);

  const updateFormObject = () => {
    const line_items = formObject.line_items || [];

    for (const cart_item of cart) {
      const index = line_items.findIndex((item) => item.item_id == cart_item._id);
      const item = products.find((item) => item._id == cart_item._id);

      const TaxGroups = response.TaxGroups || []
      const tax_group = TaxGroups.find((tax_group) => tax_group._id === item.tax_group_id)

      if (index == -1) {
        line_items.push({
          "item_id": item._id,
          "item_name": item.name,
          "hsn_or_sac": item.hsn_or_sac,
          "description": item.description,
          "account_id": item.sales_account_id,
          "track_inventory": item.track_inventory,
          "track_serial_number": item.track_serial_number,
          "track_batch_number": item.track_batch_number,
          "usage_unit": item.usage_unit,
          "tax_group_id": item.tax_group_id,
          "tax_group": tax_group,
          "quantity": cart_item.quantity,
          "item_price": item.sales_rate || 0,
          "item_gross_total": item.sales_rate || 0,
          "item_total": item.sales_rate || 0,
          "discount_percentage": 0,
          "discount_amount": 0,
          "status": 'Pending',
          "serial_numbers": [],
        });
      } else {
        line_items[index].quantity = cart_item.quantity;
      }
    }

    setFormObject({
      line_items: line_items,
      shipping_charge: 0,
    });

    invoiceItemAdjustment(getFormObject(), setFormObject, setArrValue, response);
  }

  useEffect(() => {
    if (response) {
      updateFormObject();
    }
  }, [cart, response]);

  return (<>
    <Drawer
      title={"Place Order"}
      placement={'bottom'}
      closable={false}
      onClose={() => {
        setOpen(false)
      }}
      open={open}
      key={'bottom'}
    >
      {!orderId && <div className="flex flex-col gap-4">
        <Input placeholder="Name" onChange={(e) => {
          setName(e.target.value)
        }} />
        <div className='flex gap-4 items-center'>
          +91
          <Input placeholder="Phone Number" type='number' onChange={(e) => {
            setPhone(e.target.value)
          }} />
        </div>
        <button className="bg-black text-white px-4 py-2" onClick={() => {
          placeOrder();
        }}>Place Order</button>
      </div>}
      {orderId && <>
        <div>
          Order Summary:-
        </div>
        {cart.map((product) => {
          return <div className='flex justify-between'>
            <span>{product.name}</span>
            <span>{product.quantity}</span>
          </div>
        })}
        <div className='flex justify-center gap-4 mt-3'>
          <button className="bg-white text-black px-4 py-2 border" onClick={() => {
            setOpen(false);
          }}>Cancel</button>
          <button className="bg-black text-white px-4 py-2" onClick={() => {
            placeOrder();
          }}>Place Order</button>
        </div>
      </>
      }
    </Drawer>

    <div className="fixed bottom-0 left-0 right-0 text-white px-4 py-2"
      style={{
        background: 'black'
      }} onClick={() => {
        setOpen(true)
      }}>
      <div className="flex items-center justify-between">
        <div className='flex gap-4'>

          <div className="relative">
            <ShoppingCartOutlined
              style={{ fontSize: '20px' }}
              className="mr-2"
            />
            <span className="absolute bottom-4 left-3.5 ">
              <Badge size="small" count={cart.length} />
            </span>
          </div>
          <span>₹{totalPrice}</span>
        </div>
        <button className="bg-transparent text-white px-4 py-2 " >CHECKOUT →</button>
      </div>
    </div>
  </>
  )
}

export default BottomCartBar

function RND(value) {
  return value ? +(+(value).toFixed(2)) : +(value);
}

function invoiceItemAdjustment(formObject, setFormObject, setArrValue, response) {
  let INV = { ...formObject };

  let line_items = [...(formObject.line_items || [])];

  let total_adjustments = 0;
  let total_before_tax_and_adjustments = 0;
  let sub_total = 0;
  let total_quantity = 0;
  let total = 0;
  let tax_map = {};
  let inter_state = false;
  const location_id = INV.location_id;
  let adjustments = 0;

  if (!response.OrgPrefs?.discount_after_tax) {
    adjustments = RND(adjustments - +(INV.discount_amount || 0));
    adjustments = RND(adjustments + +(INV.shipping_charge || 0));
  }

  for (let i = 0; i < line_items.length; i++) {
    let IN_I = line_items[i];
    if (!IN_I?.item_id) {
      continue;
    }
    total_quantity += +(IN_I.quantity || 0);
  }

  for (let i = 0; i < line_items.length; i++) {
    let ITEM = { ...line_items[i] };

    if (!ITEM?.item_id) {
      continue;
    }

    let item_gross_total = +(ITEM.quantity) * +(ITEM.item_price);

    if (ITEM.discount_value == null || ITEM.discount_value == undefined) {
      ITEM.discount_value = 0;
    }

    ITEM.discount_value = RND(+(ITEM.discount_value));

    let item_level_adjustment = 0;

    if (ITEM.discount_type === 'percent') {
      const discount = RND((item_gross_total * (ITEM.discount_value / 100)));
      item_level_adjustment = RND(0 - (discount || 0));
      item_gross_total = RND(item_gross_total - discount);
    } else {
      item_level_adjustment = RND(0 - +(ITEM.discount_value || 0));
      item_gross_total = RND(item_gross_total - +(ITEM.discount_value || 0));
    }

    console.log("item_gross_total", item_gross_total);

    let taxable_amount = 0;
    let before_adjustment_amount = item_gross_total;
    let after_adjustment_amount = +(before_adjustment_amount);

    console.log("adjustments", adjustments);

    after_adjustment_amount += +(adjustments * +(ITEM.quantity)) / +(total_quantity);

    if (ITEM.is_tax_inclusive) {
      taxable_amount = RND((after_adjustment_amount * 100) / (100 + +(ITEM.item_tax_percentage)));
      before_adjustment_amount = RND(taxable_amount - ((adjustments * +(ITEM.quantity)) / +(total_quantity)));
    } else {
      console.log("ITEM.quantity", ITEM.quantity);
      console.log("ITEM.item_price", ITEM.item_price);
      console.log("adjustments", adjustments);
      console.log("total_quantity", total_quantity);
      console.log("item_level_adjustment", item_level_adjustment);

      taxable_amount = RND(+((ITEM.quantity) * +(ITEM.item_price) + (adjustments * +(ITEM.quantity)) / +(total_quantity)) + +(item_level_adjustment));
    }

    console.log("taxable_amount", taxable_amount);

    total_before_tax_and_adjustments = RND(total_before_tax_and_adjustments + before_adjustment_amount);

    const tax_group = ITEM.tax_group || {};

    let tax_amount = 0;
    let tax_details = [];

    console.log("tax_group.taxes", tax_group.taxes);

    if ((response.OrgPrefs?.place_of_supply || "Madhya Pradesh") == (INV.shipping_state || "Madhya Pradesh")) {
      const CGST_Taxes = tax_group.taxes?.filter((tax) => tax.tax_type == 'CGST') || [];
      const SGST_Taxes = tax_group.taxes?.filter((tax) => tax.tax_type == 'SGST') || [];

      for (let j = 0; j < CGST_Taxes.length; j++) {
        const new_value = RND((taxable_amount * +(CGST_Taxes[j].tax_percentage)) / 100);
        tax_amount += new_value;
        tax_map[CGST_Taxes[j].name] = tax_map[CGST_Taxes[j].name] ? tax_map[CGST_Taxes[j].name] + new_value : new_value;

        tax_details.push({
          tax_id: CGST_Taxes[j]._id,
          tax_name: CGST_Taxes[j].name,
          tax_percentage: CGST_Taxes[j].tax_percentage,
          tax_type: CGST_Taxes[j].tax_type,
          tax_amount: new_value,
          output_account_id: CGST_Taxes[j].output_account_id,
          input_account_id: CGST_Taxes[j].input_account_id
        });
      }

      for (let j = 0; j < SGST_Taxes.length; j++) {
        const new_value = RND((taxable_amount * +(SGST_Taxes[j].tax_percentage)) / 100);
        tax_amount += new_value;
        tax_map[SGST_Taxes[j].name] = tax_map[SGST_Taxes[j].name] ? tax_map[SGST_Taxes[j].name] + new_value : new_value;

        tax_details.push({
          tax_id: SGST_Taxes[j]._id,
          tax_name: SGST_Taxes[j].name,
          tax_percentage: SGST_Taxes[j].tax_percentage,
          tax_type: SGST_Taxes[j].tax_type,
          tax_amount: new_value,
          output_account_id: SGST_Taxes[j].output_account_id,
          input_account_id: SGST_Taxes[j].input_account_id
        });
      }

      inter_state = false;
    } else {
      const IGST_Taxes = tax_group.taxes?.filter((tax) => tax.tax_type == 'IGST') || [];

      for (let j = 0; j < IGST_Taxes.length; j++) {
        const new_value = RND((taxable_amount * +(IGST_Taxes[j].tax_percentage)) / 100);
        tax_amount += new_value;
        tax_map[IGST_Taxes[j].name] = tax_map[IGST_Taxes[j].name] ? tax_map[IGST_Taxes[j].name] + new_value : new_value;

        tax_details.push({
          tax_id: IGST_Taxes[j]._id,
          tax_name: IGST_Taxes[j].name,
          tax_percentage: IGST_Taxes[j].tax_percentage,
          tax_type: IGST_Taxes[j].tax_type,
          tax_amount: new_value,
          output_account_id: IGST_Taxes[j].output_account_id,
          input_account_id: IGST_Taxes[j].input_account_id
        });
      }

      inter_state = true;
    }

    console.log("tax_amount", tax_amount);

    ITEM.item_tax_amount = tax_amount;
    ITEM.taxable_amount = taxable_amount;

    console.log("item_gross_total", item_gross_total);
    console.log("tax_amount", tax_amount);
    console.log("taxable_amount", taxable_amount);
    console.log("tax_details", tax_details);

    try {
      setArrValue('line_items', i, 'item_gross_total', item_gross_total);
      setArrValue('line_items', i, 'item_tax_amount', tax_amount);
      setArrValue('line_items', i, 'taxable_amount', taxable_amount);
      setArrValue('line_items', i, 'tax_details', tax_details);
      setArrValue('line_items', i, 'location_id', location_id);
    } catch (e) {
    }

    total_adjustments = adjustments;
    total = total + taxable_amount + tax_amount;
  }

  console.log("total", total);

  var after_tax_adjustments = 0;

  if (response.OrgPrefs?.discount_after_tax) {
    after_tax_adjustments = RND(after_tax_adjustments - (INV.discount_amount));
    after_tax_adjustments = RND(after_tax_adjustments + (INV.shipping_charge));
  }

  console.log("response.OrgPrefs?.discount_after_tax", response.OrgPrefs?.discount_after_tax);
  console.log("after_tax_adjustments", after_tax_adjustments);

  let final_total = total + after_tax_adjustments;
  let new_final_total = final_total;
  // new_final_total = +((final_total).toFixed(0));

  const rounded_total = +(new_final_total.toFixed(0));
  const round_off = +(rounded_total - new_final_total).toFixed(2);
  INV.adjustment = round_off;
  after_tax_adjustments = RND(after_tax_adjustments + (INV.adjustment));
  new_final_total = RND(final_total + (INV.adjustment));

  setFormObject({
    "sub_total": total_before_tax_and_adjustments,
    "total_before_tcs": total_before_tax_and_adjustments,
    "summary": total_before_tax_and_adjustments,
    "tax_map": tax_map,
    "total": new_final_total,
    "adjustment": INV.adjustment,
  });
}