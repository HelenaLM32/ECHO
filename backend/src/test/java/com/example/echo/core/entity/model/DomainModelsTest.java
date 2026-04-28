package com.example.echo.core.entity.model;

import com.example.echo.core.entity.categories.model.Category;
import com.example.echo.core.entity.dispute.model.Dispute;
import com.example.echo.core.entity.dispute.model.DisputeMessage;
import com.example.echo.core.entity.follows.model.Follow;
import com.example.echo.core.entity.follows.model.FollowId;
import com.example.echo.core.entity.items.model.Item;
import com.example.echo.core.entity.ordermessages.model.OrderMessage;
import com.example.echo.core.entity.orders.model.Order;
import com.example.echo.core.entity.profile.model.Profile;
import com.example.echo.core.entity.reviews.model.Review;
import com.example.echo.core.entity.role.model.Role;
import com.example.echo.core.entity.sharedkernel.exceptions.BuildException;
import com.example.echo.core.entity.user.model.User;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class DomainModelsTest {

    @Test
    void userGetInstanceValid() throws Exception {
        User user = User.getInstance("john@example.com", "johnny", "Abcdef12", true);
        assertEquals("john@example.com", user.getEmail());
        assertEquals("johnny", user.getUsername());
        assertTrue(user.getIsActive());
    }

    @Test
    void userGetInstanceInvalidThrows() {
        assertThrows(BuildException.class, () -> User.getInstance("bad", "jo", "123", true));
    }

    @Test
    void roleGetInstanceValid() throws Exception {
        Role role = Role.getInstance("ROLEADMIN");
        assertEquals("ROLEADMIN", role.getName());
    }

    @Test
    void roleGetInstanceInvalidThrows() {
        assertThrows(BuildException.class, () -> Role.getInstance("R1"));
    }

    @Test
    void itemGetInstanceValid() throws Exception {
        Item item = Item.getInstance(1, "Titulo", "Desc", 10.0, "SERVICE", 2);
        assertEquals(1, item.getCreatorId());
        assertEquals("Titulo", item.getTitle());
        assertEquals(10.0, item.getBasePrice());
    }

    @Test
    void itemGetInstanceInvalidThrows() {
        assertThrows(BuildException.class, () -> Item.getInstance(0, "a", "d", -1.0, "x", -2));
    }

    @Test
    void orderGetInstanceValid() throws Exception {
        Order order = Order.getInstance(3, 8, 24.5);
        assertEquals("PENDING", order.getStatus());
        assertEquals(3, order.getBuyerId());
    }

    @Test
    void orderGetInstanceInvalidThrows() {
        assertThrows(BuildException.class, () -> Order.getInstance(null, 0, -1.0));
    }

    @Test
    void orderMessageGetInstanceValid() throws Exception {
        OrderMessage message = OrderMessage.getInstance(1, 2, "hola");
        assertEquals("hola", message.getContent());
    }

    @Test
    void orderMessageGetInstanceInvalidThrows() {
        assertThrows(BuildException.class, () -> OrderMessage.getInstance(1, 2, ""));
    }

    @Test
    void disputeGetInstanceAndClose() throws Exception {
        Dispute dispute = Dispute.getInstance(4, 5, "Motivo válido largo");
        assertEquals("OPEN", dispute.getStatus());
        dispute.closeDispute("resuelto");
        assertEquals("CLOSED", dispute.getStatus());
        assertEquals("resuelto", dispute.getResolution());
    }

    @Test
    void disputeGetInstanceInvalidThrows() {
        assertThrows(BuildException.class, () -> Dispute.getInstance(0, 0, "corta"));
    }

    @Test
    void disputeMessageGetInstanceValid() throws Exception {
        DisputeMessage message = DisputeMessage.getInstance(1, 2, "texto");
        assertEquals(1, message.getDisputeId());
        assertEquals("texto", message.getMessage());
    }

    @Test
    void disputeMessageGetInstanceInvalidThrows() {
        assertThrows(BuildException.class, () -> DisputeMessage.getInstance(1, 2, "  "));
    }

    @Test
    void reviewGetInstanceValid() throws Exception {
        Review review = Review.getInstance(9, 7, 5, " excelente ");
        assertEquals(5, review.getScore());
        assertEquals("excelente", review.getComment());
    }

    @Test
    void reviewGetInstanceInvalidThrows() {
        assertThrows(BuildException.class, () -> Review.getInstance(1, 1, 6, "x"));
    }

    @Test
    void categoryGetInstanceDefaults() {
        Category category = Category.getInstance(" Name ", " slug ", "desc", null, null);
        assertEquals("Name", category.getName());
        assertEquals("slug", category.getSlug());
        assertTrue(category.getIsActive());
    }

    @Test
    void followAndFollowIdEquality() {
        Follow follow = new Follow(1, 2);
        assertEquals(1, follow.getFollowerId());
        assertEquals(2, follow.getFollowingId());

        FollowId id1 = new FollowId(1, 2);
        FollowId id2 = new FollowId(1, 2);
        assertEquals(id1, id2);
        assertEquals(id1.hashCode(), id2.hashCode());
    }

    @Test
    void profileGetInstanceSetsDefaults() {
        Profile profile = Profile.getInstance(1, "pepe");
        assertEquals(1, profile.getUserId());
        assertEquals("pepe", profile.getPublicName());
    }
}
