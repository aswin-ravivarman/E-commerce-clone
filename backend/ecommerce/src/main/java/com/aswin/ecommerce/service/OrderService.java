package com.aswin.ecommerce.service;

import com.aswin.ecommerce.dto.OrderDTO;
import com.aswin.ecommerce.entity.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(OrderDTO dto);
    List<Order> getUserOrders(Long userId);
}
