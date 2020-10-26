package travelplanner.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import travelplanner.dao.PlanRouteDao;
import travelplanner.dao.UserPlanDao;
import travelplanner.model.entity.PlanRoute;
import travelplanner.model.entity.UserPlan;

import java.util.List;

@Service
public class PlanRouteService {

    @Autowired
    private PlanRouteDao planRouteDao;

    public void addPlanRoute(PlanRoute planRoute) {
        planRouteDao.addPlanRoute(planRoute);
    }

    public List<PlanRoute> getPlanRoutesByPlanId(int planId) {
        return planRouteDao.getPlanRoutesByPlanId(planId);
    }
}
