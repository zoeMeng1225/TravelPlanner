package travelplanner.dao;

import javax.persistence.NoResultException;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import travelplanner.model.entity.PlanRoute;
import travelplanner.model.entity.Route;
import travelplanner.service.PlanRouteService;

import java.util.ArrayList;
import java.util.List;

@Repository
public class RouteDao {
    @Autowired
    private SessionFactory sessionFactory;

    @Autowired
    private PlanRouteService planRouteService;

    public void addRoute(Route route) {
        Session session = null;
        try {
            session = sessionFactory.openSession();
            session.beginTransaction();
            session.save(route);
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

    public Route getRouteByHashCode(String hashcode) {
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            CriteriaBuilder builder = session.getCriteriaBuilder();
            CriteriaQuery<Route> criteriaQuery = builder.createQuery(Route.class);
            //select plan.id from plan
            Root<Route> root = criteriaQuery.from(Route.class);
            criteriaQuery.select(root).where(builder.equal(root.get("hashcode"), hashcode));
            Route route = session.createQuery(criteriaQuery).getSingleResult();
            session.getTransaction().commit();
            return route;
        } catch (NoResultException e) {
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public List<Route> getRoutesByPlanId(int planId) {
        List<Route> routes = new ArrayList<>();
        try (Session session = sessionFactory.openSession()) {
            session.beginTransaction();
            // get PlanRoute with planId
            List<PlanRoute> planRouteList = planRouteService.getPlanRoutesByPlanId(planId);
            for (PlanRoute planRoute : planRouteList) {
                routes.add(planRoute.getRoute());
            }
            session.getTransaction().commit();
        } catch (NoResultException e) {
            return null;
        } catch (Exception e) {
            e.printStackTrace();
        }
        if (routes != null && routes.size() != 0) {
            return routes;
        }
        return null;
    }
}
