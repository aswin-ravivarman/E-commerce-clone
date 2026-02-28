package com.aswin.ecommerce.controller;

import com.aswin.ecommerce.dto.OrderDTO;
import com.aswin.ecommerce.entity.Order;
import com.aswin.ecommerce.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:3000")
public class OrderController {

    private final OrderService orderService;
    public OrderController(OrderService orderService) { this.orderService = orderService; }

    @PostMapping("/create")
    public Order createOrder(@RequestBody OrderDTO dto) { 
        return orderService.createOrder(dto); 
    }

    @GetMapping("/user/{userId}")
    public List<Order> getUserOrders(@PathVariable Long userId) {
        return orderService.getUserOrders(userId);
    }
}
