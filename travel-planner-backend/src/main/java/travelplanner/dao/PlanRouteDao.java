package travelplanner.dao;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import travelplanner.model.entity.*;

import javax.persistence.NoResultException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;

@Repository
public class PlanRouteDao {
    @Autowired
    private SessionFactory sessionFactory;

    public void addPlanRoute(PlanRoute planRoute) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.save(planRoute);
            session.getTransaction().commit();
        } catch (Exception e) {
            e.printStackTrace();
            assert session != null;
            session.getTransaction().rollback();
        } finally {
            if (session != null) {
                session.close();
            }
        }
    }

    public List<PlanRoute> getPlanRoutesByPlanId(int planId) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            CriteriaBuilder criteriaBuilder = session.getCriteriaBuilder();
            CriteriaQuery<PlanRoute> query = criteriaBuilder.createQuery(PlanRoute.class);
            Root<PlanRoute> root = query.from(PlanRoute.class);
            query.select(root).where(criteriaBuilder.equal(root.get("plan"), planId));
            List<PlanRoute> planRoutes = session.createQuery(query).getResultList();
            session.getTransaction().commit();
            return planRoutes;
        } catch (NoResultException e) {
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            if (session != null){
                session.getTransaction().rollback();
            }
        } finally {
            if (session != null){
                session.close();
            }
        }
        return null;
    }
}
