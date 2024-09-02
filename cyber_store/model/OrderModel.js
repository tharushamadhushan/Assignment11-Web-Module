export class OrderModel {
    constructor(order_id,order_name,cus_name,unit_price,qty,total) {
        this.order_id = order_id;
        this.order_name=order_name;
        this.cus_name=cus_name;
        this.unit_price=unit_price;
        this.total=total;
        this.qty=qty;

    }
}