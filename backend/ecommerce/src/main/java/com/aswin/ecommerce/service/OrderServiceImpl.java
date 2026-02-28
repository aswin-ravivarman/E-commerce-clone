package com.aswin.ecommerce.service;

import com.aswin.ecommerce.dto.OrderDTO;
import com.aswin.ecommerce.entity.Order;
import com.aswin.ecommerce.entity.OrderItem;
import com.aswin.ecommerce.entity.Product;
import com.aswin.ecommerce.entity.User;
import com.aswin.ecommerce.repository.OrderRepository;
import com.aswin.ecommerce.repository.ProductRepository;
import com.aswin.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public OrderServiceImpl(OrderRepository orderRepo, UserRepository userRepo, ProductRepository productRepo) {
        this.orderRepo = orderRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    @Override
    @Transactional
    public Order createOrder(OrderDTO dto) {
        User user = userRepo.findById(dto.userId).orElseThrow();
        Order order = new Order();
        order.setUser(user);
        order.setTotalPrice(dto.totalPrice);
        order.setOrderTime(LocalDateTime.now());

        // Create and save order items
        List<OrderItem> orderItems = new ArrayList<>();
        if (dto.getItems() != null) {
            for (OrderDTO.OrderItemDTO itemDTO : dto.getItems()) {
                Product product = productRepo.findById(itemDTO.getProductId()).orElseThrow();
                OrderItem orderItem = new OrderItem();
                orderItem.setOrder(order);
                orderItem.setProduct(product);
                orderItem.setQuantity(itemDTO.getQuantity());
                orderItem.setPrice(itemDTO.getPrice());
                orderItems.add(orderItem);
            }
        }
        order.setOrderItems(orderItems);

        return orderRepo.save(order);
    }

    @Override
    public List<Order> getUserOrders(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return orderRepo.findByUser(user);
    }
}
