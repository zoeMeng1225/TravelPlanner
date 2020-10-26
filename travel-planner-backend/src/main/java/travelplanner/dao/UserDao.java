package travelplanner.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import travelplanner.model.entity.Authorities;
import travelplanner.model.entity.User;

import javax.persistence.NoResultException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;


@Repository
public class UserDao {
    @Autowired
    private SessionFactory sessionFactory;

    public void addUser(User user) {

        user.setEnabled(true);
        Session session = null;
        Authorities authorities = new Authorities();
        authorities.setUsername(user.getUsername());
        authorities.setAuthorities("ROLE_USER");

        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.save(authorities);
            session.save(user);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            session.getTransaction().rollback();
        } finally {
            if (session != null) {
                session.close();
            }
        }

    }

    public User getUserByUserName(String userName) {
        User user = null;
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            CriteriaBuilder builder = session.getCriteriaBuilder();
            CriteriaQuery<User> criteriaQuery = builder.createQuery(User.class);
            Root<User> root = criteriaQuery.from(User.class);
            criteriaQuery.select(root).where(builder.equal(root.get("username"), userName));
            user = session.createQuery(criteriaQuery).getSingleResult();
            session.getTransaction().commit();
        } catch (NoResultException e) {
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return user;
    }

    public User getUserByUserId(int userId) {
        User user = null;
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            CriteriaBuilder builder = session.getCriteriaBuilder();
            CriteriaQuery<User> criteriaQuery = builder.createQuery(User.class);
            Root<User> root = criteriaQuery.from(User.class);
            criteriaQuery.select(root).where(builder.equal(root.get("id"), userId));
            user = session.createQuery(criteriaQuery).getSingleResult();
            session.getTransaction().commit();
        } catch (NoResultException e) {
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return user;
    }
}
