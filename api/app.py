import flask_sqlalchemy
import datetime
import sqlalchemy
import flask_potion
import flask_potion.fields as fields
import flask
import flask.ext.cors as cors
import calendar


app = flask.Flask(__name__)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True
db = flask_sqlalchemy.SQLAlchemy(app)
api = flask_potion.Api(app)
cors.CORS(
    app,
    supports_credentials=True,
    headers=['Content-Type'],
    expose_headers=['Link', 'X-Total-Count']
)


class Client(db.Model):
    __table_args__ = (
        sqlalchemy.UniqueConstraint('name'),
    )
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    projects = sqlalchemy.orm.relationship(
        "Project",
        cascade="delete",
        backref=sqlalchemy.orm.backref('client'),
    )

    workentries = sqlalchemy.orm.relationship(
        "WorkEntry",
        primaryjoin="Client.id == Project.client_id",
        secondaryjoin="Project.id == WorkEntry.project_id",
        secondary="project",
        lazy='dynamic',
        backref=sqlalchemy.orm.backref('client', viewonly=True, uselist=False),
        viewonly=True
    )


class Project(db.Model):
    __table_args__ = (
        sqlalchemy.UniqueConstraint('client_id', 'name'),
    )
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    client_id = db.Column(
        db.Integer,
        db.ForeignKey('client.id'),
        nullable=False,
    )
    workentries = sqlalchemy.orm.relationship(
        "WorkEntry",
        lazy="dynamic",
        cascade="delete",
        backref="project",
    )


class WorkEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(
        db.Integer,
        db.ForeignKey('project.id'),
        nullable=False,
    )
    start = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer)
    message = db.Column(db.String)


db.create_all()


class ClientResource(flask_potion.ModelResource):

    class Meta:
        model = Client
        read_only_fields = ['projects']

    class Schema:
        projects = fields.Array(fields.Inline('project'))

    @flask_potion.routes.ItemRoute.POST('/billing')
    def billing(
            self,
            client,
            month: fields.Integer(minimum=1, maximum=12)
    ) -> fields.Any():
        now = datetime.datetime.utcnow()
        _, stop_day = calendar.monthrange(now.year, month)
        start = datetime.datetime(now.year, month, 1, 1, 1, 1)
        stop = datetime.datetime(now.year, month, stop_day, 23, 59, 59)
        res = {'sum': 0, 'projects': []}

        for project in client.projects:
            p = {'name': project.name, 'duration': 0}
            for entry in project.workentries.filter(
                    WorkEntry.start >= start,
                    WorkEntry.start <= stop
            ):
                p['duration'] += entry.duration
            res['projects'].append(p)
            res['sum'] += p['duration']
        return res


class ProjectResource(flask_potion.ModelResource):

    class Meta:
        model = Project

    class Schema:
        client = flask_potion.fields.ToOne('client')


class WorkEntryResource(flask_potion.ModelResource):

    class Meta:
        model = WorkEntry
        read_only_fields = ['client']

    class Schema:
        project = flask_potion.fields.ToOne('project')
        client = flask_potion.fields.ToOne('client')
        start = fields.DateTime(default=datetime.datetime.utcnow)

    @flask_potion.routes.Route.GET
    def overview(self) -> fields.Any():
        res = []
        for entry in WorkEntry.query.order_by(
                sqlalchemy.desc(WorkEntry.start)).all():
            res.append(
                {
                    'client': entry.client.name,
                    'project': entry.project.name,
                    'date': entry.start.strftime("%d/%m/%y"),
                    'duration': entry.duration,
                    'message': entry.message,
                }
            )
        return res


api.add_resource(ClientResource)
api.add_resource(ProjectResource)
api.add_resource(WorkEntryResource)


if __name__ == '__main__':
    app.run(threaded=True, debug=True)
