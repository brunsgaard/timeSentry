import unittest
import app
import json


class FlaskrTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.app.test_client()

    def tearDown(self):
        pass

    def test_empty_client_list(self):
        resp = self.app.get('/client')
        data = json.loads(resp.data.decode())
        self.assertEqual(data, [])


if __name__ == '__main__':
    unittest.main()
