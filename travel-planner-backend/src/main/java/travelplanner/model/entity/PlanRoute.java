package travelplanner.model.entity;

import java.io.Serializable;

import javax.persistence.*;

@Entity
@Table(name = "planroute",
        indexes = {@Index(name = "idx_id", columnList = "id",unique = true)})
@lombok.Data
public class PlanRoute implements Serializable {
    private static final long serialVersionUID = 2652327132296064143L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.EAGER)
    private Plan plan;

    @ManyToOne(fetch = FetchType.EAGER)
    private Route route;
}
