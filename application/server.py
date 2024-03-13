from flask import Flask, render_template, request, jsonify
import util

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/feature1')
def feature1():
    return render_template('feature1.html', skills_list=util.complete_skills_list())

@app.route('/prediction', methods=['POST'])
def prediction():
    selected_skills = request.json.get('skills')
    result_label, probabilities = util.prediction(selected_skills)
    return jsonify(result=result_label, probabilities=probabilities)


@app.route('/missing_skills_analysis', methods=['POST'])
def missing_skills_analysis():
    selected_skills = request.form.get('skills')
    target_job_role = request.form.get('targetRole')
    percent_covered, skills_left = util.missing_skills_analysis(selected_skills, target_job_role)
    return jsonify(percent_covered=percent_covered, skills_left=skills_left)


@app.route('/feature2')
def feature2():
    return render_template('feature2.html', skills_list=util.complete_skills_list())


@app.route('/feature3')
def feature3():
    return render_template('feature3.html', skills_list=util.complete_skills_list())

if __name__ == '__main__':
    util.load_artifacts()
    app.run(host='0.0.0.0', port=5000, debug=False)
